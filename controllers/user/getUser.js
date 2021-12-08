//GET -> /users/:idUser - Retorna info del id del usuario que venga en el path param

const getDB = require('../../database/getDB');

const getUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el id del usuario del que queremos obtener la información
    const { idUser } = req.params;

    //Obtener el id del usuario que hace la request
    const idReqUser = req.userAuth.id;

    //Obtener los datos del usuario de los cuales queremos la información
    const [user] = await connection.query(`SELECT * FROM user WHERE id = ?`, [
      idUser,
    ]);

    if (user.length < 1) {
      throw new error(
        `El usuario con id ${idUser} no existe en la base de datos`
      );
    }

    // Para el perfil público necesitamos mostar sus productos
    const [products] = await connection.query(
      `select name, price, description from product where idUser = ?`,
      [idUser]
    );

    // Por defecto creo en todos una propiedad info que se sacará cuando no existan productos
    const userProducts = {
      info: 'No existen productos para este usuario',
    };

    // Si el usuario tiene productos se cargan en userProducts
    if (products.length > 1) {
      userProducts.data = [];
      for (let i = 0; i < products.length; i++) {
        userProducts.data.push({
          name: products[i].name,
          price: products[i].price,
          description: products[i].description,
        });
      }
    }

    // Buscamos las valoraciones del usuario
    const [opinions] = await connection.query(
      `select user.name, user_vote.vote, user_vote.comment, user_vote.date
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
    if (opinions.length > 1) {
      userVotes.data = [];
      for (let i = 0; i < products.length - 1; i++) {
        userVotes.data.push({
          userName: opinions[i].name,
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
      avatar: user[0].avatar,
    };

    // Si el usuario quiere ver su perfil, añadimos info
    if (user[0].id === idReqUser) {
      userInfo.username = user[0].username;
      userInfo.email = user[0].email;
      userInfo.birthday = user[0].birthday;
      userInfo.biography = user[0].biography;
      userInfo.phone = user[0].phone;
      userInfo.street = user[0].street;
      userInfo.postalCode = user[0].postalCode;
      userInfo.city = user[0].city;
      userInfo.province = user[0].province;
      userInfo.latitude = user[0].latitude;
      userInfo.longitude = user[0].longitude;
    }

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

module.exports = getUser;
