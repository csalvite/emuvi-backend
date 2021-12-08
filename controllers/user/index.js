/* 
    Index para exportar todos los middleware de usuarios
*/

const newUser = require('./newUser');
const validateUser = require('./validateUser');
const loginUser = require('./loginUser');
const editUser = require('./editUser');
const deleteUser = require('./deleteUser');
const getUser = require('./getUser');
const editUserAvatar = require('./editUserAvatar');
const editUserData = require('./editUserData');

module.exports = {
  newUser,
  validateUser,
  loginUser,
  editUser,
  deleteUser,
  getUser,
  editUserAvatar,
  editUserData,
};
