//GET -> /users/:idUser/favorite - Devuelve una lista de productos
// que consten como favoritos para el id de ese usuario.

const getDB = require('../../database/getDB');

const favProducts = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

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
        `SELECT id, idUser, idProduct, user.name, user.id
                  FROM user LEFT JOIN user_favorite_product on (user.id = user_favorite_product.idUser)
                  WHERE user.id = ? and product.sold is false
                  ORDER BY ${orderBy} ${orderDirection}`,
        [idUser, `%${search}%`, `%${search}%`]
      );
    } else {
      [products] = await connection.query(
        `SELECT user_favorite_product.idProduct, user_favorite_product.price, user.name, user.id
                  FROM user LEFT JOIN product on (user.id = product.idUser)
                  WHERE user.id = ? and product.sold is false
                  ORDER BY ${orderBy} ${orderDirection}`,
        [idUser]
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

module.exports = favProducts;