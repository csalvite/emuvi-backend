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
            `select id, name, price, description, createdAt from product where idUser = ? and sold = false`,
            [idUser]
        );

        if (product.length < 1) {
            const error = new Error('No hay productos subidos todavía');
            error.httpStatus = 404;
            throw error;
        }

        let products = [];
        if (product.length > 1) {
            for (let i = 0; i < product.length; i++) {
                const [photos] = await connection.query(
                    `select name from product_photo where idProduct = ?`,
                    [product[i].id]
                );

                products.push({
                    name: product[i].name,
                    price: product[i].price,
                    description: product[i].description,
                    photos,
                });
            }
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

module.exports = userProducts;
