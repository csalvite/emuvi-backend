const getDB = require('../../database/getDB');
async function addFavProduct(req, res, next) {
    let connection;
    try {
        connection = await getDB();
        const { idProduct } = req.params;
        const idReqUser = req.userAuth.id;
        const [favexits] = await connection.query(
            `
            SELECT * FROM user_favorite_product WHERE idUser = ? AND idProduct = ?`,
            [req.auth.id, idProduct]
        );
        if (favexits.length > 0) {
            const error = new Error('Ya tienes ese producto en tus favoritos');
            error.httpStatus = 404;
            throw error;
        }
        const [result] = await connection.query(
            `INSERT INTO user_favorite_product(idUser, idProduct) VALUES(?, ?)`,
            [req.auth.id, , idProduct]
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
}
module.exports = { addFavProduct };
