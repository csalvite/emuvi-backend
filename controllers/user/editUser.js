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

    //Email

    //en caso de que obtengamos un mail, comprobamos si es distinto al existente

    if (newEmail && newEmail !== user[0].email) {
      const [email] = await connection.query(
        `SELECT id FROM users WHERE email = ?`,
        [newEmail]
      );
      // si el email existe lanzamos un error
      if (email.leght > 0) {
        const error = new Error(
          'Ya existe un usuario con ese email en la base de datos'
        );
        error.httpStatus = 409;
        throw error;
      }
      //creamos codigo de registro  de un solo uso
      const registrationCode = generateRandomString(40);

      // actualizamos el usuario junto con el codigo de registro

      await connection.query(
        `UPDATE users SET email = ?, registrationCode = ?, active = false, modifiedAt = ?
        WHERE id = ?`,
        [newEmail, registrationCode, new Date(), idUser]
      );

      // enviamos mail de confirmacion al nuevo email registrado
      await verifyEmail(newEmail, registrationCode);

      //Actualizamos el mensage que enviaremos al "res.send".
      message += ', comprueba tu nuevo mail para activarlo';
    }
    //NOMBRE

    //En caso de que haya nombre comprobamos si es distinto al existente

    if (username && username !== user[0].name) {
      `UPDATE users SET username = ?, modifiedAt = ? where id = ?`,
        [username, new Date(), idUser];
    }

    res.send({
      status: 'ok',
      message,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUser;
