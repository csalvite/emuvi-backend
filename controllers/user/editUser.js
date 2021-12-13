const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateRandomString, changeEmail } = require('../../helpers');

const editUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //Obtener el id usuario para modificar
        const { idUser } = req.params;

        //Obtener nombre de usuario y contraseña
        const { newUsername, newEmail } = req.body;

        //Si no llega ningun dato lanzamos un Error
        if (!newUsername && !newEmail) {
            const error = new Error('Faltan campos por completar');
            error.httpStatus = 400;
            throw error;
        }

        //Obtener el email, password y username del usuario actual.
        const [user] = await connection.query(
            `SELECT username, email FROM user WHERE id = ?`,
            [idUser]
        );

        // Variable message que se enviará en el res.send
        let message = 'Usuario actualizado:';

        /* 
      Si existen newUsername y newEmail pero son iguales a los ya registrados no se hace la actualización
    */
        if (
            newUsername &&
            newUsername === user[0].username &&
            newEmail &&
            newEmail === user[0].email
        ) {
            const error = new Error(
                'No se ha podido realizar la actualización de usuario'
            );
            error.httpStatus = 409;
            throw error;
        }

        /* 
      En caso de que actualice su email, comprobamos si es distinto al existente
    */

        if (newEmail && newEmail !== user[0].email) {
            // Antes de cambiarlo comprobamos que no existe otro usuario con ese mismo email
            const [emailQuery] = await connection.query(
                `SELECT id FROM user WHERE email = ?`,
                [newEmail]
            );

            // Si el email existe lanzamos un error
            if (emailQuery.length > 0) {
                const error = new Error(
                    'Ya existe un usuario con ese email en la base de datos'
                );
                error.httpStatus = 409;
                throw error;
            }
            //creamos codigo de registro  de un solo uso
            const registrationCode = generateRandomString(40);

            // actualizamos el usuario junto con el codigo de registro
            await connection.query(
                `UPDATE user SET email = ?, registrationCode = ?, active = 0, modifiedAt = ?
        WHERE id = ?`,
                [newEmail, registrationCode, new Date(), idUser]
            );

            // enviamos mail de confirmacion al nuevo email registrado
            await changeEmail(newEmail, registrationCode);

            //Actualizamos el mensage que enviaremos al "res.send".
            message += ' comprueba tu nuevo mail para activarlo.';
        }

        /* 
      Username
      
      En caso de que haya username comprobamos si es distinto al existente
    */

        if (newUsername && newUsername !== user[0].username) {
            await connection.query(
                `UPDATE user SET username = ?, modifiedAt = ? where id = ?`,
                [newUsername, new Date(), idUser]
            );

            message += ' Nombre de usuario actualizado.';
        }

        res.send({
            status: 'ok',
            message,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUser;
