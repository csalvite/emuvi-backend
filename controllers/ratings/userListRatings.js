const getDB = require('../../database/getDB');

const userListRatings = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const { search, order, direction } = req.query;

        const validOrderOptions = ['vote', 'createdAt', 'name'];

        const validDirectionOptions = ['ASC', 'DESC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'DESC';

        let votes;
        if (search) {
            [votes] = await connection.query(
                `select user.name, user.avatar, user_vote.vote, user_vote.comment
                from user inner join user_vote
                    on (user.id = user_vote.idUser)
                where idUserVoted = ? and user.name like ? or user_vote.vote = ?
                order by ${orderBy} ${orderDirection}`,
                [idUser, `%${search}%`, `%${search}%`]
            );
        } else {
            [votes] = await connection.query(
                `select user.name, user.avatar, user_vote.vote, user_vote.comment
                from user inner join user_vote
                    on (user.id = user_vote.idUser)
                where idUserVoted = ?`,
                [idUser]
            );
        }

        res.send({
            status: 'Ok',
            data: votes,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userListRatings;
