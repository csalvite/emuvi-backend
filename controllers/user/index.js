/* 
    Index para exportar todos los middleware de usuarios
*/

const newUser = require('./newUser');
const validateUser = require('./validateUser');

module.exports = { newUser, validateUser };
