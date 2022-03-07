/* 
    Endpoint que borrará las ofertas recibidas por el usuario según el estado recibido por query
*/

const getDB = require('../../database/getDB');

const deleteUserSales = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        // Por query podemos recoger el id de la oferta a borrar o el estado, si quiere borrar todas las de un estado en concreto
        const { id, status } = req.query;

        if (!id && !status) {
            const error = new Error('No se ha idicado qué ofertas eliminar.');
            error.httpStatus = 400;
            throw error;
        }

        // Variable para almacenar el mensaje que se enviará en res.send
        let message;
        if (id) {
            // Si existe idOffer a borrar, la eliminamos
            await connection.query(
                `delete from user_reserve_product where id = ? and idUserOwner = ?`,
                [id, idUser]
            );

            message = 'Oferta eliminada correctamente';
        }

        // Eliminamos por estado
        if (status) {
            // Si indica el tipo de estado que quiere eliminar
            const validOptions = ['pendiente', 'aceptada', 'denegada'];
            if (!validOptions.includes(status)) {
                const error = new Error(
                    'Debes indicar un estado correcto para eliminar'
                );
                error.httpStatus = 404;
                throw error;
            }

            await connection.query(
                `delete from user_reserve_product where reserveStatus = ? and idUserOwner = ?`,
                [status, idUser]
            );

            message = `Ofertas del tipo ${status} eliminadas correctamente`;
        }

        res.send({
            status: 'OK',
            message,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteUserSales;
