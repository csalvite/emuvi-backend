// PUT -> /users/:idUser/password  Permite editar la contraseña de un usuario

const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const editUserPassword = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //Se obtiene el id del usuario.
    const { idUser } = req.params;

    //Se obtiene la contraseña antigua y la nueva.
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      const error = new Error(
        'Debes indicar la contraseña a cambiar y la nueva'
      );
      error.httpStatus = 400;
      throw error;
    }

    //Obtenemos la contraseña del usuario.
    const [user] = await connection.query(
      `SELECT password FROM user WHERE id = ?`,
      [idUser]
    );

    //Guardamos en una variable un valor booleano: contraseña correcta o incorrecta.
    const isValid = await bcrypt.compare(oldPassword, user[0].password);

    //Si la contraseña antigua es errónea, lanzamos un error.
    if (!isValid) {
      const error = new Error('Contraseña incorrecta');
      error.httpStatus = 401;
      throw error;
    }

    //Hasheamos la nueva contraseña.
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    //Se actualiza la base de  datos.
    await connection.query(
      `UPDATE user SET password = ?, modifiedAt = ? WHERE id = ?`,
      [hashedPassword, new Date(), idUser]
    );

    res.send({
      status: 'ok',
      message: 'Contraseña actualizada',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUserPassword;
