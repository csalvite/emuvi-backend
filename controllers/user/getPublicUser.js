//GET -> /users/:idUser - Retorna info del id del usuario que venga en el path param

const getDB = require('../../database/getDB');

const getPublicUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario del que queremos obtener la información
        const { idUser } = req.params;

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

        // Para el perfil público necesitamos mostar sus productos
        const [products] = await connection.query(
            `select id, name, price, description from product where idUser = ?`,
            [idUser]
        );

        // Por defecto creo en todos una propiedad info que se sacará cuando no existan productos
        const userProducts = {
            info: 'No existen productos para este usuario',
        };

        // Si el usuario tiene productos se cargan en userProducts
        userProducts.data = [];
        if (products.length > 1) {
            for (let i = 0; i < products.length; i++) {
                const [photos] = await connection.query(
                    `select name from product_photo where idProduct = ?`,
                    [products[i].id]
                );

                userProducts.data.push({
                    id: products[i].id,
                    name: products[i].name,
                    price: products[i].price,
                    description: products[i].description,
                    photos,
                });
            }
        }

        // Buscamos las valoraciones del usuario
        const [opinions] = await connection.query(
            `select user.name, user.avatar, user_vote.vote, user_vote.comment, user_vote.date
        from user inner join user_vote
          on (user.id = user_vote.idUser)
        where user_vote.idUserVoted = ?;`,
            [idUser]
        );

        // Igual que con products
        const userVotes = {
            info: 'No constan valoraciones para este usuario',
        };

        // Cargamos un array de objetos con las propiedades de cada valoracion
        userVotes.data = [];
        if (opinions.length > 1) {
            for (let i = 0; i < opinions.length; i++) {
                userVotes.data.push({
                    name: opinions[i].name,
                    userAvatar: opinions[i].avatar,
                    vote: opinions[i].vote,
                    comment: opinions[i].comment,
                    date: opinions[i].date,
                });
            }
        }

        // Si el usuario no es el propietario del mismo, mostramos la info básica
        const userInfo = {
            name: user[0].name,
            lastname: user[0].lastname,
            mediaVotes: user[0].avgVote,
            avatar: user[0].avatar,
            biography: user[0].biography,
            email: user[0].email,
            phone: user[0].phone,
            city: user[0].city,
            province: user[0].province,
            postalCode: user[0].postalCode,
        };

        res.send({
            status: 'ok',
            data: {
                userInfo,
                userProducts,
                userVotes,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        //Liberamos la conexión.
        if (connection) connection.release();
    }
};

module.exports = getPublicUser;
