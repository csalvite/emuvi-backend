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

        const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        // Lista de categorías en página de inicio.
        const [category] = await connection.query(
            `SELECT distinct(category) FROM product`
        );

        let categories = [];
        for (let i = 0; i < category.length; i++) {
            categories.push({
                name: category[i].category, // categoryName
            });
        }

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

        let featuredProducts = [];
        for (let i = 0; i < 10; i++) {
            const [photos] = await connection.query(
                `select name from product_photo where idProduct = ?`,
                [product[i].id]
            );
            featuredProducts.push({
                name: product[i].name,
                price: product[i].price,
                date: product[i].createdAt,
                id: product[i].id,
                photos,
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
