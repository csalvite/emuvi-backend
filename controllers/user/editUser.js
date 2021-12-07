const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateRandomString, verifyEmail } = require('../../helpers');

const editUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //Obtener el id usuario para modificar
    const { idUser } = req.params;

    //Obtener nombre de usuario y contraseña
    const { newUsername, newEmail, oldPassword, newPassword } = req.body;

    //Si no llega ningun dato lanzamos un Error
    if (!(newUsername, newEmail, oldPassword, newPassword)) {
      const error = new Error('Faltan campos por completar');
      error.httpStatus = 400;
      throw error;
    }

    //Obtener el email, password y username del usuario actual.
    const [user] = await connection.query(
      `SELECT username, password, email FROM user WHERE id = ?`,
      [idUser]
    );

    // Variable message que se enviará en el res.send
    let message = 'Usuario actualizado: ';

    /* 
      En caso de que actualice su email, comprobamos si es distinto al existente
    */

    if (newEmail && newEmail !== user[0].email) {
      // Antes de cambiarlo comprobamos que no existe otro usuario con ese mismo email
      const [email] = await connection.query(
        `SELECT id FROM users WHERE email = ?`,
        [newEmail]
      );

      // Si el email existe lanzamos un error
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
        `UPDATE user SET email = ?, registrationCode = ?, active = false, modifiedAt = ?
        WHERE id = ?`,
        [newEmail, registrationCode, new Date(), idUser]
      );

      // enviamos mail de confirmacion al nuevo email registrado
      await verifyEmail(newEmail, registrationCode);

      //Actualizamos el mensage que enviaremos al "res.send".
      message += ', comprueba tu nuevo mail para activarlo';
    }

    /* 
      Username
      
      En caso de que haya username comprobamos si es distinto al existente
    */

    if (username && username !== user[0].name) {
      `UPDATE user SET username = ?, modifiedAt = ? where id = ?`,
        [username, new Date(), idUser];
    }

    /* 
      Password
    */

    const [passwordQuery] = connection.query(
      `select password from user where id = ?`,
      [idUser]
    );

    // Compruebo que la contraseña que quiere cambiar es la guardada en base de datos
    const isValid = await bcrypt.compare(
      oldPassword,
      passwordQuery[0].password
    );

    if (!isValid) {
      const error = new Error(
        'La contraseña que quieres cambiar es diferente a la guardad en base de datos'
      );
      error.httpStatus = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizamos la contraseña
    await connection.query(
      `update user set password = ?, modifiedAt = ? where id = ?`,
      [hashedPassword, new Date(), idUser]
    );

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
