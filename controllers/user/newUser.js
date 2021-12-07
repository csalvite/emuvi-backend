const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { generateRandomString, verifyEmail } = require('../../helpers');

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos los campos necesarios del body.
    const { username, email, password } = req.body;

    // Comprobamos que inserta todos los datos
    if (!(username && email && password)) {
      const error = new Error('Debes insertar todos los datos obligatorios');
      error.httpStatus = 403;
      throw error;
    }

    // Comprobamos si el email existe en la base de datos.
    const [user] = await connection.query(
      `SELECT id FROM user WHERE email = ?`,
      [email]
    );

    // Si el email ya existe lanzamos un error.
    if (user.length > 0) {
      const error = new Error('Ya existe un usuario con ese email');
      error.httpStatus = 409;
      throw error;
    }

    // Creamos un código de registro de un solo uso.
    const registrationCode = generateRandomString(40);

    // Encriptamos la contraseña.
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Guardamos el usuario en la base de datos.
    await connection.query(
      `INSERT INTO user (username, email, password, registrationCode, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, registrationCode, new Date()]
    );

    // Enviamos un mensaje de verificación al email del usuario.
    await verifyEmail(email, registrationCode);

    res.send({
      status: 'ok',
      message: 'Usuario registrado, comprueba tu email para activarlo',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
