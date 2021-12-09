const getDB = require('../../database/getDB');

const products = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { search, order, postalCode } = req.query;

    const validOrderOptions = [
      'product.createdAt',
      'product.name',
      'product.price',
      'product.modifiedAt',
    ];

    const validDirectionOptions = ['DESC', 'ASC'];

    const orderBy = validOrderOptions.includes(name) ? order : 'name';

    const orderDirection = validDirectionOptions.includes(createdAd)
      ? createdAd
      : 'DESC';

    let products;

    // Obtenemos la información de la entrada de la base de datos
    const [products] = await connection.query(
      `
                SELECT product.id, product.name, product.price, product.createdAt, product.sold,
                FROM product
                WHERE product.name = ?
                GROUP BY product.createdAt
                ORDER BY ${orderBy} ${orderDirection}
                `,
      [`%${name}%``%${search}%`, `%${search}%`]
    );

    // Obtenemos las fotos de la entrada seleccionada.

    const [photos] = await connection.query(
      `SELECT idProduct FROM product_photo WHERE id = ?`,
      []
    );

    res.send({
      status: 'ok',
      data: {
        entry: {
          ...entry[0],
          photos,
        },
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = products;
