// DELETE -> /products/:idProduct - Borra un producto, tenemos que comprobar que el usuario que hace la request
// es el propietario del producto (select idUser from product where idUser = idReqUser)

const getDB = require('../../database/getDB');

const deleteProduct = async (rec, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //Obtenemos el id del producto que queremos borrar.
    const { idProduct } = req.params;

    //Si el producto que queremos borrar pertenece al usuario que quiere borrarlo,
    //lo borramos.

    await connection.query(`DELETE FROM product WHERE id = ?`, [idProduct]);

    res.send({
      status: 'ok',
      message: 'Producto eliminado',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteProduct;
