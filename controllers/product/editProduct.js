//app.put('/product/:idProduct', isAuth, productExits, canEditProduct, editProduct)
const getDB = require('../../database/getDB');

const editProduct = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //vamos con el path param del producto para editar
    const { idProduct } = req.params;

    //Vamos requerir los datos del producto a editar
    const { name, price, description, category } = req.body;

    if (!name || !price || !description) {
      const error = new Error(
        'Faltan campos obligatorios para editar el producto'
      );
      error.httpStatus = 409;
      throw error;
    }

    //Buscamos los productos
    const [product] = await connection.query(
      `SELECT name, price, description, category FROM product WHERE id = ?`,
      [idProduct]
    );

    //Primero nos quedamos con el valor que viene del body pero si alguna propiedad es undefined recogemos el valor que tenia la base de datos
    const updateProduct = {
      name: name || product[0].name,
      price: price || product[0].price,
      description: description || product[0].description,
      category: category || product[0].category,
    };

    //Vamos a actualizar el producto
    await connection.query(
      `UPDATE product SET name = ?, price = ?, category = ?, description = ?, modifiedAt = ?
      WHERE id = ?`,
      [
        updateProduct.name,
        updateProduct.price,
        updateProduct.category,
        updateProduct.description,
        new Date(),
        idProduct,
      ]
    );

    res.send({
      status: 'ok',
      message: `El producto con el siguiente id ${idProduct} ha sido editado correctamente`,
      data: updateProduct,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = editProduct;
