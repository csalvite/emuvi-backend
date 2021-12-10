const getDB = require('../../database/getDB');

const lookingProduct = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idProduct } = req.params;

    let products;

    if (search) {
      [products] = await connection.query(
        `SELECT * FROM product 
        WHERE product.id = ? and product.sold is false
        `,
        [idProduct]
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

module.exports = lookingProduct;
