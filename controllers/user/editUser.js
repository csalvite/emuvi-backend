const getDB = require('../../database/getDB');

const { generateRandomString, verifyEmail } = require('../../helpers');

const editUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //Obtener el id usuario para modificar
    const { idUser } = req.params;
    //Obtener nombre de usuario y contraseña
    const { username, newEmail } = req.body;

    //Si no llega ningun dato lanzamos un Error
    if (!username && !newEmail) {
      const error = new Error('Faltan campos por completar');
      error.httpStatus = 400;
      throw error;
    }

    //Obtener el email y el nombre de usuario del usuario actual.
    const [user] = await connection.query(
      `SELECT email, username FROM users WHERE id = ?`,
      [idUser]
    );

    //mensaje que enviaremos en el "res.send"

    let message = 'Usuario actualizado con exito';

    //en caso de que obtengamos un mail, comprobamos si es distinto al existente

    if (newEmail && newEmail !== user[0].email) {
      const [email] = await connection.query(
        `SELECT id FROM users WHERE email = ?`,
        [newEmail]
      );
      // si el email existe lanzamos un error
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
