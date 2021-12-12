//app.post('/vote/:id', validAuth, canEditVote, editVote');
const getDB = require('../../database/getDB');

const editVote = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { idVote } = req.params;
        const { vote, comment } = req.body;
        const options = [0, 1, 2, 3, 4, 5];

        if (!vote) {
            const error = new Error('Tienes que incluir un voto');
            error.httpStatus = 400;
            throw error;
        }
        if (!options.includes(Number(vote))) {
            const error = new Error(
                'Tiene que emitir tu voto entre un numero entero del 0 al 5'
            );
            throw error;
        }
        //Actualizamos el voto
        await connection.query(
            `UPDATE user_vote SET vote= ?, comment = ? WHERE id = ?`,
            [vote, comment, idVote]
        );

        res.send({
            status: 'ok',
            message: 'Tu voto se ha cambiado correctamente',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editVote;
