const getDB = require('../database/getDB');

const canEditUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

    const idReqUser = req.userAuth.id;

    if (Number(idUser) !== idReqUser) {
      const error = new Error('No eres el propietario del usuario a editar');
      error.httpStatus = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = canEditUser;
