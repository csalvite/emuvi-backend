const getDB = require('../../database/getDB');
const { newOfferMail } = require('../../helpers');

const newOffer = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idProduct, idUser } = req.params;

        const [isSold] = await connection.query(
            `select reserveStatus from user_reserve_product where idProduct = ?`,
            [idProduct]
        );

        if (isSold.length > 0 && isSold[0].reserveStatus === 'aceptada') {
            const error = new Error(
                'No podemos proceder a la reserva de este producto ya que el vendedor ya ha aceptado otra compra.'
            );
            error.httpStatus = 403;
            throw error;
        }

        const [isOwner] = await connection.query(
            `select id from product where id = ? and idUser = ?`,
            [idProduct, req.userAuth.id]
        );

        if (isOwner.length > 0) {
            const error = new Error('Error: Eres el propietario.');
            error.httpStatus = 400;
            throw error;
        }

        // Si el producto no tiene una reserva aceptada procedemos a crear la reserva y enviar el email al usuario propietario

        // Obtengo el id y email del usuario propietario
        const [userOwner] = await connection.query(
            `select user.id as id, user.email as email from user inner join product
            on (user.id = product.idUser)
        where product.id = ?`,
            [idProduct]
        );

        // Insertamos una nueva reserva
        await connection.query(
            `insert into user_reserve_product (idUserOwner, idProduct, idUserBuyer, createdAt) values (?, ?, ?, ?)`,
            [userOwner[0].id, idProduct, idUser, new Date()]
        );

        // Necesitamos el nombre del usuario comprador y del producto para el correo
        const [user] = await connection.query(
            `select name from user where id = ?`,
            [idUser]
        );

        const [product] = await connection.query(
            `select name from product where id = ?`,
            [idProduct]
        );

        // Enviamos correo notificando al usuario propietario que tiene una nueva oferta
        await newOfferMail(
            userOwner[0].email,
            user[0].name,
            product[0].name,
            userOwner[0].id
        );

        res.send({
            status: 'Ok',
            message:
                'Reserva realizada con éxito, a la espera de la decisión del comprador!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newOffer;
