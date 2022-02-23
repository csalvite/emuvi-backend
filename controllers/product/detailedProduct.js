const getDB = require('../../database/getDB');

const lookingProduct = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idProduct } = req.params;

        const [products] = await connection.query(
            `SELECT product.*, user.latitude as lat, user.longitude as lon
            FROM product inner join user on (product.idUser = user.id)
            WHERE product.id = ? and product.sold is false
      `,
            [idProduct]
        );

        if (products.length < 1) {
            const error = new Error(
                'No se ha encontrado el producto seleccionado'
            );
            error.httpStatus = 404;
            throw error;
        }

        const [photos] = await connection.query(
            `select name from product_photo where idProduct = ?`,
            [idProduct]
        );

        const product = {
            id: products[0].id,
            name: products[0].name,
            price: products[0].price,
            description: products[0].description,
            category: products[0].category,
            sold: products[0].sold,
            date: products[0].createdAt,
            modified: products[0].modifiedAt,
            idUser: products[0].idUser,
            lat: products[0].lat,
            lon: products[0].lon,
            photos,
        };

        res.send({
            status: 'ok',
            data: {
                product,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = lookingProduct;
