// Perfil Privado de un usuario

const getDB = require('../../database/getDB');

const getPrivateUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUser = req.userAuth.id;

        // Comprobamos en el middleware de canEditUser si el usuario que hace la request es el propietario

        //Obtener los datos del usuario de los cuales queremos la información
        const [user] = await connection.query(
            `SELECT user.*, avg(ifnull(user_vote.vote, 0)) as avgVote
              FROM user left join user_vote
                on (user.id = user_vote.idUserVoted)
              WHERE user.id = ?`,
            [idUser]
        );

        if (user.length < 1) {
            throw new error(
                `El usuario con id ${idUser} no existe en la base de datos`
            );
        }

        const userInfo = {
            id: user[0].id,
            name: user[0].name,
            lastname: user[0].lastname,
            mediaVotes: user[0].avgVote,
            avatar: user[0].avatar,
            city: user[0].city,
            province: user[0].province,
            postalCode: user[0].postalCode,
            username: user[0].username,
            email: user[0].email,
            birthday: user[0].birthday,
            biography: user[0].biography,
            phone: user[0].phone,
            street: user[0].street,
            latitude: user[0].latitude,
            longitude: user[0].longitude,
        };

        res.send({
            status: 'Ok',
            data: userInfo,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getPrivateUser;
