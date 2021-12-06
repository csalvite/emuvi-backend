const morgan = require('morgan');
require('dotenv').config();
const express = require('express');

const app = express();

const { PORT } = process.env;

app.use(express.json());
app.use(morgan('dev'));

//midedleware error

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
