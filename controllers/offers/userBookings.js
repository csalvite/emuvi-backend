/* 
    Retorna un listado de las ofertas enviadas por el usuario
*/

const getDB = require('../../database/getDB');

const userBookings = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

    const { order, direction } = req.query;

    const validOrderOptions = ['reserveStatus', 'createdAt'];

    const validDirectionOptions = ['DESC', 'ASC'];

    const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

    const orderDirection = validDirectionOptions.includes(direction)
      ? direction
      : 'ASC';

    const [user] = await connection.query(
      `select distinctrow user.id as idBuyer, concat(user.name, " ", user.lastname) as buyerName,
            (select concat(user.name, " ",user.lastname)
                from user
                where user.id = user_reserve_product.idUserOwner
            ) as sellerName,
            (select product.name
            from product
            where product.id = user_reserve_product.idProduct) as productName,
        user_reserve_product.reserveStatus, user_reserve_product.createdAt
        from user inner join user_reserve_product
            on (user.id = user_reserve_product.idUserBuyer)
        where user_reserve_product.idUserBuyer = ?
        order by ${orderBy} ${orderDirection};`,
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
        createdAt: user[i].createdAt,
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
