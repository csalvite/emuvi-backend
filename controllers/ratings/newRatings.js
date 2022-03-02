//app.post('/user/:id/votes', validAuth, canVote, newVote);
const getDB = require('../../database/getDB');

const newRatings = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { vote, comment } = req.body;

        const { idUser, idProduct } = req.params;

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

        await connection.query(
            `
            INSERT INTO user_vote (vote, comment, idUser, idUserVoted, idProduct, date)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [vote, comment, req.userAuth.id, idUser, idProduct, new Date()]
        );

        res.send({
            status: 'OK',
            message: 'Has añadido un nuevo voto con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newRatings;
