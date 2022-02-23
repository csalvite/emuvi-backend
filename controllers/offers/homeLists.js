// GET -> / - Es el inicio de la página, en ella se carga la lista de categorías
// y otra lista con los productos destacados (los 10 últimos subidos, por ejemplo).

const getDB = require('../../database/getDB');

const homeLists = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

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
        const [products] = await connection.query(
            `
        SELECT id, name, price, createdAt, sold,idUser
        FROM product
        WHERE sold = 0
        ORDER BY createdAt DESC
        LIMIT 10
      `
        );

        let featuredProducts = [];
        for (let i = 0; i < products.length; i++) {
            const [photos] = await connection.query(
                `select id, name from product_photo where idProduct = ?`,
                [products[i].id]
            );

            featuredProducts.push({
                ...products[i],
                photos,
            });
        }

        // Añadí en los resultados las categorias
        res.send({
            status: 'OK',
            featuredProducts,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = homeLists;
