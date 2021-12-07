const getDB = require('../database/getDB');

const userExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

    const [user] = await connection.query(
      `select id, active from user where id = ?`,
      [idUser]
    );

    if (user.length < 1 || !user[0].active) {
      const error = new Error(
        'El usuario seleccionado no consta como activo o es inexistente'
      );
      error.httpStatus = 404;
      throw error;
    }

    // si el usuario consta en base de datos y está activo, pasamos al siguiente controlador
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = userExists;
