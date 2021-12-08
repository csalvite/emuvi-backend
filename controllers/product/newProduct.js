const { query } = require('express');
const getDB = require('../../database/getDB');
const { savePhoto, validate } = require('../../helpers');
const newProductSchema = require('../../schemas/newProductSchema');

async function newProduct(req, res, next) {
  let connection;
  try {
    connection = await getDB();
    await validate(newProductSchema, req.body);
    const idReqUser = req.userAuth.id;

    //Vamos requerir nombre, precio y descripcion para un nuevo producto
    const { name, price, description } = req.body;

    const [user] = await connection.query(`SELECT id FROM user WHERE id = ?`, [
      idReqUser,
    ]);
    //Si no hay usuario lanzamos un error
    if (user.length < 1) {
      const error = new Error('El usuario no existe');
      error.httpStatus = 404;
      throw error;
    }
    //Añadimos producto con sus respectivos atributos.

    const [newProduct] = await connection.query(
      `INSERT INTO product (idUser, name, price, category, description, sold, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [idReqUser, name, price, category, description, sold, new Date()]
    );

    //Recuperamos el id del producto que creamos
    const idProduct = newProduct.insertId;
    //Vamos comprobar si existe el req.files y cuantas fotos tiene, nuestro limite será 5.

    if (req.files && Object.keys(req.files).length > 0) {
      //nos quedamos con 5 fotos
      for (const photo of Object.values(req.files).slice(0, 5)) {
        // Guardamos la foto en disco y obtenemos su nombre.
        const photoName = await savePhoto(photo);

        // Guardamos la foto en la tabla de fotos_producto.
        await connection.query(
          `INSERT INTO product_photo (name, idProduct) VALUES (?, ?)`,
          [photoName, idProduct]
        );
      }
    }

    res.send({
      status: 'OK',
      message: 'Nuevo producto creado con éxito',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { newProduct };
