const getDB = require('../../database/getDB');
/* const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const { generateRandomString, verifyEmail } = require('../../helpers'); */

// Auth0 es la librería que usaremos para logear a nuestros usuarios, por lo que para poder
// guardar información sobre ellos para las ventas de productos almacenaremos su info
const loginAuth0 = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el email y el password que pedimos.
        const { email } = req.body;

        // Si falta algún campo lanzamos un error.
        if (!email) {
            const error = new Error(
                'Para acceder hacen falta indicar un email'
            );
            error.httpStatus = 400;
            throw error;
        }

        // Comprobamos si existe un usuario con ese email.
        const [user] = await connection.query(
            `SELECT * FROM user WHERE email = ? and active = 1`,
            [email]
        );

        // Creamos la variable que devolveremos más adelante
        let isRegistered = true;

        // Si no hay un usuario con ese email lo insertamos
        if (user.length < 1) {
            isRegistered = false;
        }

        res.send({
            status: 'ok',
            isRegistered,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = loginAuth0;
