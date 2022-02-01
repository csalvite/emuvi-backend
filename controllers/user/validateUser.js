const getDB = require('../../database/getDB');
const saltRounds = 10;
const { generateRandomString, savePhoto } = require('../../helpers');

const path = require('path');

const { UPLOADS_DIRECTORY } = process.env;

const validateUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

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
            registrationCode,
        } = req.body;

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
            error.httpStatus = 400;
            throw error;
        }

        // Si existe un avatar, guardamos la imagen en disco
        // No conseguimos guardar en bbdd el avatar por lo que por ahora para
        // seguir avanzando comentamos todo el tema de guardar avatar en el registro

        /* let avatarName;

        if (req.files && req.files.avatar) {
            console.log('HOLI?');
            avatarName = await savePhoto(req.files.avatar, 0);
            console.log('Avatar: ' + req.files.avatar);
        } */

        // Si están todos los datos obligatorios, actualizamos el usuario final
        await connection.query(
            `update user set name = ?, lastname = ?, birthday = ?, biography = ?, active = 1, registrationCode = null, createdAt = ?, phone = ?, latitude = ? , longitude = ?, street = ?, postalCode = ?, city = ?, province = ?
            where registrationCode = ?`,
            [
                name,
                lastname,
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
                registrationCode,
            ]
        );

        res.send({
            status: 'ok',
            message: 'Usuario registrado y activado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = validateUser;
