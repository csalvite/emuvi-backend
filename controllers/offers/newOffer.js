const getDB = require('../../database/getDB');

const newOffer = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser, idProduct } = req.params;
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newOffer;
