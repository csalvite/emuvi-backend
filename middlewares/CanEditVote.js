// Middleware que comprueba si el usuario es el propietario del producto
const getDB = require('../database/getDB');

const canEditVote = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { idVote } = req.params;

        const idReqUser = req.userAuth.id;

        //Ahora buscamos el id del usuario del voto
        const [idUserowner] = await connection.query(
            `SELECT idUser FROM user_vote WHERE id = ?`,
            [idVote]
        );
        if (idUserowner.length < 1) {
            const error = new Error(
                'No hay un usuario propietario para el voto'
            );
        }

        if (idUserowner[0].idUser !== idReqUser) {
            const error = new Error(
                'No tienes permisos para editar ese voto porque no has emitido el voto'
            );
            error.httpStatus = 403;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = canEditVote;
