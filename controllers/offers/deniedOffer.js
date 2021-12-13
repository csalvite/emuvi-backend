const getDB = require('../../database/getDB');
const { offerDeniedMail } = require('../../helpers');

const deniedOffer = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser, idOffer } = req.params;

        const [reserve] = await connection.query(
            `select id from user_reserve_product where id = ? and idUserOwner = ? and reserveStatus = 'denegada'`,
            [idOffer, idUser]
        );

        if (reserve.length > 0) {
            const error = new Error('La reserva ya ha sido denegada');
            error.httpStatus = 400;
            throw error;
        }

        // Si existe la reserva la denegamos
        await connection.query(
            `update user_reserve_product set reserveStatus = 'denegada' where id = ?`,
            [idOffer]
        );

        // Enviamos el correo notificando al usuario comprador que denegaron su propuesta de compra

        // Email usuario comprador (para notificarlo)
        const [userBuyer] = await connection.query(
            `select user.email
                from user inner join user_reserve_product
                    on (user.id = user_reserve_product.idUserBuyer)
                where user_reserve_product.id = ?`,
            [idOffer]
        );

        // Nombre del usuario vendedor
        const [sellerUser] = await connection.query(
            `select concat(name, ' ', lastname) as completeName from user where id = ?`,
            [idUser]
        );

        // Nombre del product
        const [productName] = await connection.query(
            `select product.name
                from product inner join user_reserve_product
                    on (product.id = user_reserve_product.idProduct)
                where user_reserve_product.id = ?`,
            [idOffer]
        );

        // enviamos el correo
        await offerDeniedMail(
            userBuyer[0].email,
            sellerUser[0].completeName,
            productName[0].name
        );

        res.send({
            status: 'Ok',
            message: 'Reserva denegada, se ha notificado al comprador.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deniedOffer;
