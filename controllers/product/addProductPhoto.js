const { concurrency } = require('sharp');
const getDB = require('../../database/getDB');
const { savePhoto } = require('../../helpers');

const addProductPhoto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idProduct } = req.params;
        //Si no hay foto, error.

        /*  if (!(req.files && req.files.photo)) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        } */

        //Vamos a conseguir las fotos de los productos
        const [photos] = await connection.query(
            `SELECT id FROM product_photo WHERE idProduct = ?`,
            [idProduct]
        );
        // Si hay mas de 5 lanzamos
        if (photos.length >= 5) {
            const error = new Error(
                'Este producto ya tiene las 5 fotos permitidas'
            );
            error.httpStatus = 403;
            throw error;
        }

        if (req.files && Object.keys(req.files).length > 0) {
            for (const photo of Object.values(req.files).slice(0, 5)) {
                const photoName = await savePhoto(photo, 1);
                await connection.query(
                    `INSERT INTO product_photo (name, idProduct) VALUES (?, ?)`,
                    [photoName, idProduct]
                );
            }
        }

        /*         //obtenemos el nombre de la foto de la base de datos.
        const photoName = await savePhoto(req.files.photo, 1);

        await connection.query(
            `INSERT INTO product_photo (name, idProduct) VALUES (?, ?)`,
            [photoName, idProduct]
        ); */

        res.send({
            status: 'ok',
            message: 'La foto ha sido añadida correctamente.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addProductPhoto;
