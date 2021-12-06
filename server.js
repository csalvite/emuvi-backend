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
const { loginUser } = require('./controllers/user');
/**
 * ########################
 * ## Endpoints usuarios ##
 * ########################
 */
// Logeamos a un usuario y retornamos un token.
app.post('/user/login', loginUser);

/* 
  ##############################
  ### Controlladores Usuario ###
  ##############################
*/
const { newUser, validateUser } = require('./controllers/user');

/* 
  ######################
  ### Endpoints User ###
  ######################
*/

app.post('/users', newUser);

app.post('/users/register/:registrationCode', validateUser);

/*
  #####################################
  ### Middlewares Error y Not Found ###
  #####################################
*/

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
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
