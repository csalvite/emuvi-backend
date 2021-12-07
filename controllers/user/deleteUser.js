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
    const { password, confirmpassword } = req.body;

    //Si no existe los campos contraseña y su respectiva confirmacion muestra error
    if (!password || !confirmpassword)
      throw new Error('Debes introducir contraseñas');

    if (password !== confirmpassword)
      throw new Error('La contraseña y su confirmacion no coinciden');

    /*  // Obtenemos el avatar del usuario.
    const [userAvatar] = await connection.query(
      `SELECT avatar FROM user WHERE id = ?`,
      [id]
    );

    // Si el usuario tiene un avatar lo borramos del disco.
    if (userAvatar[0].avatar) {
      await deletePhoto(userAvatar[0].avatar);
    } */

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

    const confirmHashed = await bcrypt.hash(confirmpassword, saltRounds);

    const isvalid = await bcrypt.compare(user[0].password, confirmHashed);

    if (!isvalid) {
      throw new Error('las contraseñas no son iguales');
    } else {
      await connection.query(`DELETE FROM user WHERE id = ?`, [idUser]);
    }

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
