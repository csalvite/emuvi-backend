// Middleware que comprueba si el usuario es el propietario del producto
const getDB = require('../database/getDB');

const canEditProduct = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { idProduct } = req.params;

    const idReqUser = req.userAuth.id;

    //Ahora buscamos el id del usuario del producto
    const [idUserowner] = await connection.query(
      `SELECT idUser FROM product WHERE id = ?`,
      [idProduct]
    );

    if (idUserowner[0].idUser !== idReqUser) {
      const error = new Error('No tienes permisos para editar este producto');
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
module.exports = canEditProduct;
