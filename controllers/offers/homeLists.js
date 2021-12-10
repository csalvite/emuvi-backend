// GET -> / - Es el inicio de la página, en ella se carga la lista de categorías
// y otra lista con los productos destacados (los 10 últimos subidos, por ejemplo).

const getDB = require('../../database/getDB');

const homeLists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { order, direction } = req.query;

    const validOrderOptions = ['createdAt'];

    const validDirectionOptions = ['DESC', 'ASC'];

    // Esto está guay, pero lo que hace es que si no indican un orden (que solo tiene como opciones válidas "createdAt")
    // por defecto usará createAt, en este caso no nos haría falta, podríamos usar directamente validOrderOptions en el lugar de orderBy :D
    const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

    // Aqui por ejemplo se puede indicar que la dirección sea DESC o ASC, en este indicas que por defecto sea ASC, aqui está guay
    const orderDirection = validDirectionOptions.includes(direction)
      ? direction
      : 'ASC';

    // Lista de categorías en página de inicio.

    const [category] = await connection.query(
      `SELECT distinct(category) FROM product`
    );

    // WHERE product.category = ?
    // [`%${name}%``%${search}%`, `%${search}%`]

    let categories = [];
    for (let i = 0; i < category.length; i++) {
      categories.push({
        name: category[i].category, // categoryName
      });
    }

    // El res.send debería ir al final ya que solo se envía una vez
    /* res.send({
      status: 'OK',
      data: [categories],
    }); */

    // Lista de productos destacados en página de inicio.

    const [product] = await connection.query(
      `
        SELECT product.id, product.name, product.price, product.createdAt, product.sold
        FROM product
        WHERE product.sold = 0
        GROUP BY product.id, product.name, product.price, product.createdAt, product.sold
        ORDER BY ${orderBy} ${orderDirection}
        LIMIT 10
      `
    );

    // LIMIT 10 recogerá los 10 primeros resultados de la consulta
    // Como vamos a recoger los productos con fecha de creación (createdAt) más nuevos, no hace falta
    // WHERE product.name = ?
    // [`%${name}%``%${search}%`, `%${search}%`]

    // Ojooo esto está muy guay, funciona, pero podemos sacarlo ya en la consulta xD
    let featuredProducts = [];
    for (let i = 0; i < 10; i++) {
      featuredProducts.push({
        // product - es featuredProducts
        name: product[i].name, // productName - Se sacaría solo name de product
        // molaría añadir más propiedades, rollo precio, imágenes, etc
      });
    }

    // Añadí en los resultados las categorias
    res.send({
      status: 'OK',
      data: {
        featuredProducts,
        categories,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = homeLists;
