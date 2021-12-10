const getDB = require('../../database/getDB');

const userVotes = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const [votes] = await connection.query(
            `SELECT id, comment, vote, DATETIME, idUserVoted, idUser, createdAt from user_vote where idUser = ?`,
            [idUserVoted]
        );

        res.send({
            status: 'ok',
            message: 'Tu votación se ha realizado correctamente.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userVotes;
