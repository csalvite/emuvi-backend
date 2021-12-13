const getDB = require('../../database/getDB');

const confirmNewUserMail = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { registrationCode } = req.params;

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
            `update user set active = 1, registrationCode = null where registrationCode = ?`,
            [registrationCode]
        );

        res.send({
            status: 'OK',
            message: 'Usuario activado, nuevo email registrado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = confirmNewUserMail;
