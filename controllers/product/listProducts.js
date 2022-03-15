const getDB = require('../../database/getDB');

const listProducts = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { search, order, direction, minPrice, maxPrice, rating } =
            req.query;

        const validOrderOptions = [
            'createdAt',
            'name',
            'price',
            'modifiedAt',
            'rating',
        ];

        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'DESC';

        let products;

        let select = `SELECT product.id, product.name, product.price, product.description, product.category, product.createdAt, 
                                product.sold, product.idUser, AVG(ifnull(user_vote.vote, 0)) as rating
                            FROM product left join user_vote 
                                on (product.idUser = user_vote.idUserVoted)`;

        let myWhere = ' where';
        const options = [];

        // Obtenemos la información de la entrada de la base de datos
        let data = [];

        if (search) {
            myWhere += ` (name like ? or category = ?)`;

            options.push(`%${search}%`);
            options.push(search);
        }

        if (minPrice && maxPrice) {
            if (search) {
                myWhere += ` and (price between ? and ?)`;
            } else {
                myWhere += ` (price between ? and ?)`;
            }

            options.push(Number(minPrice));
            options.push(Number(maxPrice));
        }

        /*             [products] = await connection.query(
            `${select} 
                ORDER BY ${orderBy} ${orderDirection};`,
            [options[0], options[1], options[2]]
        ); */

        if (search || (minPrice && maxPrice)) {
            select += ` ${myWhere} group by product.id, product.name, product.price, product.description, product.category, product.createdAt, 
                            product.sold, product.idUser`;
        } else {
            select += ` group by product.id, product.name, product.price, product.description, product.category, product.createdAt, 
                            product.sold, product.idUser`;
        }

        if (rating) {
            select += ` having rating between ? and 5`;
            options.push(rating);
        }

        [products] = await connection.query(
            `${select} ORDER BY ${orderBy} ${orderDirection};`,
            [options[0], options[1], options[2], options[3], options[4]]
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

module.exports = listProducts;
