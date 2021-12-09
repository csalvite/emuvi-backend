const morgan = require('morgan');
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');

// Creamos servidor express
const app = express();

const { PORT } = process.env;

// Desserializa body en formato raw
app.use(express.json());

// La morgana para support e info
app.use(morgan('dev'));

// Middleware para leer body en formato form-data
app.use(fileUpload());

/*
 * #################
 * ## Middlewares ##
 * #################
 * */

const isAuth = require('./middlewares/isAuth');
const userExists = require('./middlewares/userExists');
const canEditUser = require('./middlewares/canEditUser');

/*
 * ###############################
 * ## Controladores de usuarios ##
 * ###############################
 * */

const {
  loginUser,
  editUser,
  newUser,
  validateUser,
  deleteUser,
  getUser,
  editUserAvatar,
  editUserData,
  editUserPassword,
  userProducts,
} = require('./controllers/user');

/*
 * ##############################
 * ## Controladores de ofertas ##
 * ##############################
 * */

const {
  userBookings,
  userSales,
  deleteUserBookings,
} = require('./controllers/offers/');

/* 
######################
### Endpoints User ###
######################
*/

// Nuevo usuario
app.post('/users', newUser);

// Completa registro y activa usuario
app.post('/users/register/:registrationCode', validateUser);

// Logeamos a un usuario y retornamos un token.
app.post('/user/login', loginUser);

// Retornamos info de un usuario
app.get('/users/:idUser', isAuth, userExists, getUser); // Si el usuario es anónimo no tiene una Authorization, podrá ver igual los datos?

// Actualizamos el avatar de un usuario
app.put(
  '/users/:idUser/avatar',
  isAuth,
  userExists,
  canEditUser,
  editUserAvatar
);

// Editamos username, email y password de Usuario
app.put('/users/:idUser', isAuth, userExists, canEditUser, editUser);

// Editamos la contraseña del usuario
app.put(
  '/users/:idUser/password',
  isAuth,
  userExists,
  canEditUser,
  editUserPassword
);

// Editamos información del usuario (datos personales y de dirección)
app.put('/users/:idUser/info', isAuth, userExists, canEditUser, editUserData);

// Borramos usuario
app.delete('/users/:idUser', deleteUser);

// Mi perfil -> Mis productos
app.get('/users/:idUser/products', isAuth, userExists, userProducts);

/* 
  ##########################
  ### Endpoints Products ###
  ##########################
*/

/* app.put(
  '/product/:idProduct',
  isAuth,
  productExits,
  canEditProduct,
  editProduct
); */

/* 
  ########################
  ### Endpoints Offers ###
  ########################
*/

// Perfil de usuario -> sus ofertas enviadas (las reservas)
app.get(
  '/users/:idUser/bookings',
  isAuth,
  userExists,
  canEditUser,
  userBookings
);

// Perfil de usuario -> ofertas recibidas
app.get('/users/:idUser/offers', isAuth, userExists, canEditUser, userSales);

// Elimina las reservas en estado "denegada" del usuario
app.delete(
  '/users/:idUser/bookings',
  isAuth,
  userExists,
  canEditUser,
  deleteUserBookings
);

/*
  #####################################
  ### Middlewares Error y Not Found ###
  #####################################
*/

app.use((error, req, res, _) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'Error',
    message: error.message,
  });
});

// Middleware not found

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
