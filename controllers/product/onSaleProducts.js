// GET -> /products - Devuelde una lista de todos los productos en venta.

const getDB = require('../../database/getDB');

const onSaleProducts = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    const { search, order, direction } = req.query;

    const validOrderOptions = ['createdAt', 'product.name', 'product.price'];

    const validDirectionOptions = ['DESC', 'ASC'];

    const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

    const orderDirection = validDirectionOptions.includes(direction)
      ? direction
      : 'DESC';

    let products;

    if (search) {
      [products] = await connection.query(
        `SELECT id, idProduct, FROM product 
        WHERE product.id = ? and product.sold is false
        ORDER BY ${orderBy} ${orderDirection}`,
        [idProduct, `%${search}%`, `%${search}%`]
      );
    }

    res.send({
      status: 'ok',
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = onSaleProducts;
