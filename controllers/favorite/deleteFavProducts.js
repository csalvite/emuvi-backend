const getDB = require('../../database/getDB');

const deleteFavProduct = async (req, res, next) => {
  try {
    Connection = await getDB();

    const { idProduct } = req.params;

    const idReqUser = req.userAuth.id;

    await connection.query(`DELETE FROM user_favorite_product WHERE id = ?`, [
      idProduct,
    ]);

    res.send({
      status: 'ok',
      message: 'Producto eliminado de tu lista de favoritos',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteFavProduct;
