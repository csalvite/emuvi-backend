const getDB = require('../../database/getDB');

const addFavProduct = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idProduct } = req.params;

        const [favExits] = await connection.query(
            `
            SELECT * FROM user_favorite_product WHERE idUser = ? AND idProduct = ?`,
            [req.userAuth.id, idProduct]
        );

        if (favExits.length > 0) {
            const error = new Error('Ya tienes ese producto en tus favoritos');
            error.httpStatus = 400;
            throw error;
        }

        const [isSold] = await connection.query(
            `select sold from product where id = ?`,
            [idProduct]
        );

        if (isSold[0].sold) {
            const error = new Error('El producto ya ha sido vendido');
            error.httpStatus = 400;
            throw error;
        }

        const [result] = await connection.query(
            `INSERT INTO user_favorite_product(idUser, idProduct) VALUES(?, ?)`,
            [req.userAuth.id, idProduct]
        );

        res.send({
            status: 'ok',
            message: 'Producto añadido como favorito correctamente',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = addFavProduct;
