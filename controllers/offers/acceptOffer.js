// Endpoint para cuando vendedor acepta una oferta

const getDB = require('../../database/getDB');
const { offerAccepted } = require('../../helpers');

const acceptOffer = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser, idOffer } = req.params;

        // Si existe otra oferta para el mismo producto que ya haya sido aceptada
        const [offer] = await connection.query(
            `select reserveStatus from user_reserve_product where id = ? and idUserOwner = ?`,
            [idOffer, idUser]
        );

        if (
            offer[0].reserveStatus === 'aceptada' ||
            offer[0].reserveStatus === 'denegada'
        ) {
            const error = new Error(
                'Ya has tomado una decisión sobre esta oferta'
            );
            error.httpStatus = 403;
            throw error;
        }

        // Si puede aceptar esta oferta recogemos los campos necesarios para indicar al comprador el lugar de compra
        const { street, city, time, date } = req.body;

        if (!(street && city && time && date)) {
            const error = new Error(
                'Debes indicar todos los campos para la reunión'
            );
            error.httpStatus = 400;
            throw error;
        }

        // Si llegamos hasta aquí entendemos que podemos enviar el mail

        // Sacamos los datos para enviar el correo
        const [data] = await connection.query(
            `select distinctrow user.id as idVendedor, concat(user.name, " ", user.lastname) as sellerName,
                    user_reserve_product.idProduct,
                (select user.email
                    from user
                    where user.id = user_reserve_product.idUserBuyer
                ) as buyerEmail,
                (select product.name
                from product
                where product.id = user_reserve_product.idProduct) as productName,
                user_reserve_product.idUserBuyer,
                user_reserve_product.reserveStatus
            from user inner join user_reserve_product
                on (user.id = user_reserve_product.idUserOwner)
            where user_reserve_product.id = ?;`,
            [idOffer]
        );

        // Actualizamos la oferta como aceptada y el resto de ofertas como denegadas
        await connection.query(
            `update user_reserve_product set reserveStatus = 'aceptada' where id = ?`,
            [idOffer]
        );

        // Cambiamos el estado del producto a "vendido" -> sold = 1
        await connection.query(`update product set sold = 1 where id = ?`, [
            data[0].idProduct,
        ]);

        // Notificamos
        await offerAccepted(
            data[0].buyerEmail,
            data[0].sellerName,
            data[0].productName,
            street,
            city,
            time,
            date,
            data[0].idUserBuyer
        );

        // Denegamos el resto de ofertas para ese producto
        await connection.query(
            `update user_reserve_product set reserveStatus = 'denegada' where idUserOwner = ? and idProduct = ? and id != ?`,
            [data[0].idVendedor, data[0].idProduct, idOffer]
        );

        res.send({
            status: 'Ok',
            message:
                'Compra aceptada correctamente, hemos notificado al comprador que su compra ha sido aceptada.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = acceptOffer;
