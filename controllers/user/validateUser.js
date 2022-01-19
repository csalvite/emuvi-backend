const getDB = require('../../database/getDB');
const saltRounds = 10;
const {
    generateRandomString,
    verifyEmail,
    savePhoto,
} = require('../../helpers');

const path = require('path');

const { UPLOADS_DIRECTORY } = process.env;

const validateUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {
            username,
            email,
            password,
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
            `select id from user where email = ?`,
            [email]
        );

        if (user.length > 0) {
            const error = new Error(
                'Ya existe un usuario con ese email en la base de datos'
            );
            error.httpStatus = 403;
            throw error;
        }

        // Creamos un código de registro de un solo uso.
        const registrationCode = generateRandomString(40);

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
            `insert into user (username, name, lastname, password, email, birthday, avatar, biography, registrationCode, createdAt, phone, latitude, longitude, street, postalCode, city, province) 
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                username,
                name,
                lastname,
                password,
                email,
                birthday,
                avatarName,
                biography,
                registrationCode,
                new Date(),
                phone,
                latitude,
                longitude,
                street,
                postalCode,
                city,
                province,
            ]
        );

        // Enviamos un mensaje de verificación al email del usuario.
        await verifyEmail(email, registrationCode);

        res.send({
            status: 'ok',
            message: 'Usuario registrado, comprueba tu email para activarlo',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = validateUser;
