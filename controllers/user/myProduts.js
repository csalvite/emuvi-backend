const getDB = require('../../database/getDB');

const myProduts = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { search, order, direction } = req.query;

    const validOrderOptions = ['createdAt', 'product.name', 'product.price'];

    const validDirectionOptions = ['DESC', 'ASC'];

    const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

    const orderDirection = validDirectionOptions.includes(direction)
      ? direction
      : 'DESC';

    let produts;

    if (search) {
      [produts] = await connection.query(
        `SELECT product.name, product.price, product.category, user.name, user.id
                FROM user LEFT JOIN product on (user.id = product.idUser)
                WHERE user.id = ? and product.sold is false
                ORDER BY ${orderBy} ${orderDirection}`,
        [id, `%${search}%`, `%${search}%`]
      );
    } else {
      [produts] = await connection.query(
        `SELECT product.name, product.price, product.category, user.name, user.id
                FROM user LEFT JOIN product on (user.id = product.idUser)
                WHERE user.id = ? and product.sold is false
                ORDER BY ${orderBy} ${orderDirection}`,
        [id]
      );
    }

    res.send({
      status: 'ok',
      data: {
        produts,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = myProduts;
