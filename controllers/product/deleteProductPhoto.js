const getDB = require('../../database/getDB');
const { deletePhoto } = require('../../helpers');

const deleteProductPhoto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //vamos a por el id del producto y del usuario
        const { idProduct, idImg } = req.params;

        //conseguimos la photo
        const [photo] = await connection.query(
            `SELECT name FROM product_photo WHERE id = ? AND idProduct = ?`,
            [idImg, idProduct]
        );

        if (photo.length < 1) {
            const error = new Error(
                `La foto con el id ${idImg} no existe o no se corresponde con el producto id ${idProduct}`
            );
            error.httpStatus = 404;
            throw error;
        }

        //eliminamos la foto del servidor
        await deletePhoto(photo[0].name);

        //Y ahora eliminamos la foto de la base de datos
        await connection.query(
            `DELETE FROM product_photo WHERE id = ? AND idProduct = ?`,
            [idImg, idProduct]
        );

        res.send({
            status: 'ok',
            message: 'Photo delete!!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteProductPhoto;
