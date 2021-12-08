const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { deletePhoto } = require('../../helpers');

const deleteUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el id del usuario que queremos borrar.
    const { idUser } = req.params;
    const { password, confirmPassword } = req.body;

    //Si no existe los campos contraseña y su respectiva confirmacion muestra error
    if (!password || !confirmPassword)
      throw new Error('Debes introducir contraseñas');

    if (password !== confirmPassword)
      throw new Error('La contraseña y su confirmacion no coinciden');

    //Obtenemos el datos del usuario
    const [user] = await connection.query(
      `SELECT id, password FROM user WHERE id = ?`,
      [idUser]
    );

    if (user.length < 1) {
      const error = new Error('El usuario no existe');
      error.httpStatus = 404;
      throw error;
    }

    const isValid = await bcrypt.compare(confirmPassword, user[0].password);

    if (!isValid) {
      const error = new Error(
        'Las contraseña no es la que está guarda en base de datos'
      );
      error.httpStatus = 403;
      throw error;
    }

    // Obtenemos el avatar del usuario.
    const [userAvatar] = await connection.query(
      `SELECT avatar FROM user WHERE id = ?`,
      [idUser]
    );

    // Si el usuario tiene un avatar lo borramos del disco.
    if (userAvatar[0].avatar) {
      await deletePhoto(userAvatar[0].avatar);
    }

    await connection.query(`DELETE FROM user WHERE id = ?`, [idUser]);

    res.send({
      status: 'ok',
      message: 'Usuario eliminado',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteUser;
