const getDB = require('../../database/getDB');
const { savePhoto } = require('../../helpers');
const path = require('path');

const { UPLOADS_DIRECTORY } = process.env;

const validateUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { registrationCode } = req.params;
        const {
            name,
            lastname,
            birthday,
            biography,
            phone,
            latitude,
            longitude,
            street,
            postalCode,
            city,
            province,
        } = req.body;

        const [user] = await connection.query(
            `select id from user where registrationCode = ?`,
            [registrationCode]
        );

        if (user.length < 1) {
            const error = new Error(
                'No existen usuarios pendientes de validación'
            );
            error.httpStatus = 404;
            throw error;
        }

        // Si el usuario está pendiente de validar
        await connection.query(
            `update user set active = 1 where registrationCode = ?`,
            [registrationCode]
        );

        // Insertamos los datos que nos proporciona en el formulario de registro y activación

        // Si no existe alguno de los ""
        if (!(name && lastname && birthday)) {
            const error = new Error(
                'Debes introducir todos los datos marcados como obligatorios'
            );
            error.httpStatus = 400; // yo que sé
            throw error;
        }

        // Si existe un avatar, guardamos la imagen en disco
        let avatarName;

        if (req.files && req.files.avatar) {
            avatarName = await savePhoto(req.files.avatar, 0);
        }

        // Si están todos los datos obligatorios, actualizamos el usuario final
        await connection.query(
            `update user set name = ?, lastname = ?, avatar = ?, birthday = ?, biography = ?, registrationCode = null, createdAt = ?, phone = ?, latitude = ?, longitude = ?, street = ?, postalCode = ?, city = ?, province = ? where id = ?`,
            [
                name,
                lastname,
                avatarName,
                birthday,
                biography,
                new Date(),
                phone,
                latitude,
                longitude,
                street,
                postalCode,
                city,
                province,
                user[0].id,
            ]
        );

        res.send({
            status: 'OK',
            message: 'Usuario registrado y validado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = validateUser;
