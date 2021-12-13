const getDB = require('../../database/getDB');

const userSales = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const [user] = await connection.query(
            `select distinctrow user.id as idVendedor, concat(user.name, " ", user.lastname) as sellerName,
            (select concat(user.name, " ", user.lastname)
                from user
                where user.id = user_reserve_product.idUserBuyer
            ) as buyerName,
            (select product.name
            from product
            where product.id = user_reserve_product.idProduct) as productName,
        user_reserve_product.reserveStatus,
        user_reserve_product.createdAt
        from user inner join user_reserve_product
            on (user.id = user_reserve_product.idUserOwner)
        where user_reserve_product.idUserOwner = ?;`,
            [idUser]
        );

        if (user.length < 1) {
            const error = new Error('No hay ofertas recibidas para el usuario');
            error.httpStatus = 404;
            throw error;
        }

        let offers = [];
        for (let i = 0; i < user.length; i++) {
            offers.push({
                me: user[i].sellerName,
                buyerName: user[i].buyerName,
                product: user[i].productName,
                reserveStatus: user[i].reserveStatus,
                createdAt: user[i].createdAt,
            });
        }

        res.send({
            status: 'Ok',
            data: offers,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userSales;
