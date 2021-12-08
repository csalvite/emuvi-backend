const getDB = require('../database/getDB');

const jwt = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos la cabecera de autorización (el token).
    const { authorization } = req.headers;

    // Si no hay cabecera de autorización lanzamos un error.
    if (!authorization) {
      const error = new Error('Falta la cabecera de autorización');
      error.httpStatus = 401;
      throw error;
    }

    // Variable que almacenará la información del token.
    let tokenInfo;

    try {
      // Desencriptamos el token.
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch (_) {
      const error = new Error('El token no es válido');
      error.httpStatus = 401;
      throw error;
    }

    // Seleccionamos el usuario con el id que viene del token.
    const [user] = await connection.query(
      `SELECT active FROM user WHERE id = ?`,
      [tokenInfo.id]
    );

    // Si el usuario no está activado.
    if (!user[0].active) {
      const error = new Error(
        'El token no es válido o el usuario no está activo, revisa tu correo'
      );
      error.httpStatus = 401;
      throw error;
    }

    req.userAuth = tokenInfo;

    // Pasamos la pelota al siguiente middleware.
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isAuth;
