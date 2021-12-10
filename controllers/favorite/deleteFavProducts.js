const getDB = require('../../database/getDB');

const deleteFavProduct = async (req, res, next) => {
    try {
        Connection = await getDB();

        const { idProduct } = req.params;

        const idReqUser = req.userAuth.id;

        const [favProduct] = await connection.query(
            `SELECT * FROM user_favorite_product WHERE idUser = ?
     AND id_product = ?`,
            [req.auth.id, idProduct]
        );
        if (favProduct.length < 1) {
            const error = new Error('No tienes el producto en tus favoritos');
            error.httpStatus = 404;
            throw error;
        }

        await connection.query(
            `DELETE FROM user_favorite_product WHERE idUser = ? AND idProduct = ?`,
            [idProduct, idReqUser]
        );

        res.send({
            status: 'ok',
            message: 'Producto eliminado de tu lista de favoritos',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteFavProduct;
