const getDB = require('../../database/getDB');

const listProducts = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { search, order, direction } = req.query;

        const validOrderOptions = ['createdAt', 'name', 'price', 'modifiedAt'];

        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'DESC';

        // Obtenemos la información de la entrada de la base de datos
        let data = [];
        if (search) {
            const [products] = await connection.query(
                `
                    SELECT id, name, price, description, category, createdAt, sold
                    FROM product
                    WHERE name like ? or category like ?
                    ORDER BY ${orderBy} ${orderDirection}
                    `,
                [`%${search}%`, `%${search}%`]
            );

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
                `SELECT id, name, price, description, category, createdAt, sold
                    FROM product
                    ORDER BY ${orderBy} ${orderDirection}`
            );

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
            data: {
                data,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listProducts;
