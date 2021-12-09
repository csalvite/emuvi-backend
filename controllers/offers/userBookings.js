/* 
    Retorna un listado de las ofertas enviadas por el usuario
*/

const getDB = require('../../database/getDB');

const userBookings = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

    const [user] = await connection.query(
      `select distinctrow user.id as idBuyer, concat(user.name, " ", user.lastname) as buyerName,
            (select concat(user.name, " ",user.lastname)
                from user
                where user.id = user_reserve_product.idUserOwner
            ) as sellerName,
            (select product.name
            from product
            where product.id = user_reserve_product.idProduct) as productName,
        user_reserve_product.reserveStatus
        from user inner join user_reserve_product
            on (user.id = user_reserve_product.idUserBuyer)
        where user_reserve_product.idUserBuyer = ?;`,
      [idUser]
    );

    if (user.length < 1) {
      const error = new Error('No constan reservas para el usuario');
      error.httpStatus = 404;
      throw error;
    }

    let bookings = [];
    for (let i = 0; i < user.length; i++) {
      bookings.push({
        buyer: user[i].buyerName,
        seller: user[i].sellerName,
        product: user[i].productName,
        reserveStatus: user[i].reserveStatus,
      });
    }

    res.send({
      status: 'OK',
      data: bookings,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = userBookings;
