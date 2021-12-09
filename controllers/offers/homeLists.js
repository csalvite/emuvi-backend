// GET -> / - Es el inicio de la página, en ella se carga la lista de categorías
// y otra lista con los productos destacados (los 10 últimos subidos, por ejemplo).

const getDB = require('../../database/getDB');

const homeLists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { order, direction } = req.query;

    const validOrderOptions = ['createAt'];

    const validDirectionOptions = ['DESC', 'ASC'];

    const orderBy = validOrderOptions.includes(order) ? order : 'createAt';

    const orderDirection = validDirectionOptions.includes(direction)
      ? direction
      : 'ASC';

    // Lista de categorías en página de inicio.

    const [category] = await connection.query(
      `
       SELECT category FROM product WHERE product.category = ?
       GROUP BY product.createdAt
       ORDER BY ${orderBy} ${orderDirection}
       `,
      [`%${name}%``%${search}%`, `%${search}%`]
    );

    let categories = [];
    for (let i = 0; i < category.length; i++) {
      categories.push({
        name: category[i].categoryName,
      });
    }

    res.send({
      status: 'OK',
      data: [categories],
    });

    // Lista de productos destacados en página de inicio.

    const [product] = await connection.query(
      `
        SELECT product.id, product.name, product.price, product.createdAt, product.sold,
        FROM product
        WHERE product.name = ?
        GROUP BY product.createdAt
        ORDER BY ${orderBy} ${orderDirection}
                `,
      [`%${name}%``%${search}%`, `%${search}%`]
    );

    let featuredProducts = [];
    for (let i = 0; i < 10; i++) {
      product.push({
        name: product[i].productName,
      });
    }

    res.send({
      status: 'OK',
      data: [featuredProducts],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = homeLists;
