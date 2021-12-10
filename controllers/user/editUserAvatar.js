const getDB = require('../../database/getDB');
const { deletePhoto, savePhoto } = require('../../helpers');

const editUserAvatar = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

    if (!(req.files && req.files.avatar)) {
      const error = new Error('Debes indicar el nuevo avatar');
      error.httpStatus = 400;
      throw error;
    }

    // Obtenemos el avatar guardado en bbdd
    const [user] = await connection.query(
      `select avatar from user where id = ?`,
      [idUser]
    );

    // Si tenemos un avatar previo, lo eliminamos
    if (user[0].avatar) {
      await deletePhoto(user[0].avatar);
    }

    const avatarName = await savePhoto(req.files.avatar, 0);

    await connection.query(`update user set avatar = ? where id = ?`, [
      avatarName,
      idUser,
    ]);

    res.send({
      status: 'Ok',
      message: 'Avatar de usuario actualizado',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUserAvatar;
