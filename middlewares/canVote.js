const getDB = require('../database/getDB');

const canVote = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { idUser } = req.params;

        const idReqUser = req.userAuth.id;

        /* const [voteUser] = await connection.query(
            `SELECT * FROM user_vote WHERE idUser = ? AND idUserVoted = ?`,
            [idReqUser, idUser]
        );
        if (voteUser.length > 0) {
            const error = new Error('Ya has votado al usuario');
            error.httpStatus = 400;
            throw error;
        } */

        if (Number(idUser) === idReqUser) {
            const error = new Error('No te puedes votar a ti mismo');
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
module.exports = canVote;
