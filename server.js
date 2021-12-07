const morgan = require('morgan');
require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

const { PORT } = process.env;

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
} = require('./controllers/user');

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

// Borramos usuario
app.delete('/users/:idUser', deleteUser);

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

//middleware not found

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
