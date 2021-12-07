//GET -> /users/:idUser - Retorna info del id del usuario que venga en el path param

const getDB = require('../../database/getDB');

const idInfo = async (req, res, next) => {
  let connection;
};

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

  const userInfo = {
    name: user[0].name,
    lastname: user[0].lastname,
    avatar: user[0].avatar,
  };

  if (user[0].id === idReqUser) {
  }

  res.send({
    status: 'ok',
    data: {
      user,
    },
  });
} catch (error) {
  next(error);
} finally {
  //Liberamos la conexión.
  if (connection) connection.release();
}

module.exports = getUser;
