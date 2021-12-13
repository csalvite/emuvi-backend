//app.delete('/vote/:id', validAuth, canEditVote, deleteRatings);
const getDB = require('../../database/getDB');

const deleteRatings = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idVote } = req.params;

        //Eliminamos el voto
        await connection.query(`DELETE FROM  user_vote  WHERE id = ?`, [
            idVote,
        ]);

        res.send({
            status: 'ok',
            message: 'Tu voto se ha eliminado correctamente',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteRatings;
