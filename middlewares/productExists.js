const getDB = require('../database/getDB');
const productExists = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { idProduct } = req.params;
    const [product] = await connection.query(
      `SELECT id FROM product 
        WHERE id = ?`,
      [idProduct]
    );
    if (product.length < 1) {
      const error = new Error('El producto no existe');
      error.httpStatus = 404;
      throw error;
      next();
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = productExists;
