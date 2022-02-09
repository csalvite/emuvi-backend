/* 
    Elimina las reservas en estado "denegado" del usuario
*/

const getDB = require('../../database/getDB');

const deleteUserBookings = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const [user] = await connection.query(
            `select id
              from user_reserve_product
              where idUserBuyer = ? and reserveStatus = "denegada" 
              or 
              idUserOwner = ? and reserveStatus = "denegada"`,
            [idUser, idUser]
        );

        if (user.length < 1) {
            const error = new Error(
                'No hay reservas que consten en estado "denegada" para eliminar'
            );
            error.httpStatus = 404;
            throw error;
        }

        for (let i = 0; i < user.length; i++) {
            await connection.query(
                `delete from user_reserve_product where id = ?`,
                [user[i].id]
            );
        }

        res.send({
            status: 'OK',
            message: 'Reservas en estado "Denegada" eliminadas.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteUserBookings;
