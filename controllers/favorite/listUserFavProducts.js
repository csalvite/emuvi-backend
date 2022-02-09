const getDB = require('../../database/getDB');

const favProducts = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const { search, order, direction } = req.query;

        const validOrderOptions = ['createdAt', 'name', 'price'];

        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'DESC';

        let data = [];
        if (search) {
            const [products] = await connection.query(
                `
                    SELECT product.id, product.name, product.price, product.description, product.category, product.createdAt, product.sold
                    FROM product inner join user_favorite_product
                      on (product.id = user_favorite_product.idProduct)
                    WHERE user_favorite_product.idUser = ? and product.name like ? or product.category like ?
                    ORDER BY product.${orderBy} ${orderDirection}
                    `,
                [idUser, `%${search}%`, `%${search}%`]
            );

            if (products.length < 1) {
                const error = new Error(
                    'No existen productos para este usuario'
                );
                error.httpStatus = 404;
                throw error;
            }

            for (let i = 0; i < products.length; i++) {
                if (!products[i].sold) {
                    // Obtenemos las fotos de la entrada seleccionada.
                    const [photos] = await connection.query(
                        `SELECT name FROM product_photo WHERE idProduct = ?`,
                        [products[i].id]
                    );

                    data.push({
                        ...products[i],
                        photos,
                    });
                }
            }
        } else {
            const [products] = await connection.query(
                `
                    SELECT product.id, product.name, product.price, product.description, product.category, product.createdAt, product.sold
                    FROM product inner join user_favorite_product
                      on (product.id = user_favorite_product.idProduct)
                    WHERE user_favorite_product.idUser = ? 
                    ORDER BY product.${orderBy} ${orderDirection}
                    `,
                [idUser]
            );

            if (products.length < 1) {
                const error = new Error(
                    'No existen productos para este usuario'
                );
                error.httpStatus = 404;
                throw error;
            }

            for (let i = 0; i < products.length; i++) {
                if (!products[i].sold) {
                    // Obtenemos las fotos de la entrada seleccionada.
                    const [photos] = await connection.query(
                        `SELECT name FROM product_photo WHERE idProduct = ?`,
                        [products[i].id]
                    );

                    data.push({
                        ...products[i],
                        photos,
                    });
                }
            }
        }
        res.send({
            status: 'ok',
            data,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = favProducts;
