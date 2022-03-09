/* 
  Productos subidos por el usuario -> Mi perfil -> Mis productos
*/

const getDB = require('../../database/getDB');

const userProducts = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const [product] = await connection.query(
            `select id, name, price, description, category, sold, createdAt from product where idUser = ? and sold = 0`,
            [idUser]
        );

        if (product.length < 1) {
            const error = new Error('No hay productos subidos todavía');
            error.httpStatus = 404;
            throw error;
        }

        let products = [];
        if (product.length > 0) {
            for (let i = 0; i < product.length; i++) {
                const [photos] = await connection.query(
                    `select id, name from product_photo where idProduct = ?`,
                    [product[i].id]
                );

                products.push({
                    id: product[i].id,
                    name: product[i].name,
                    price: product[i].price,
                    sold: product[i].sold,
                    description: product[i].description,
                    category: product[i].category,
                    createdAt: product[i].createdAt,
                    photos,
                });
            }
        }

        res.send({
            status: 'ok',
            products,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userProducts;
