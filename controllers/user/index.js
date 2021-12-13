/* 
    Index para exportar todos los middleware de usuarios
*/

const newUser = require('./newUser');
const validateUser = require('./validateUser');
const loginUser = require('./loginUser');
const editUser = require('./editUser');
const deleteUser = require('./deleteUser');
const getPublicUser = require('./getPublicUser');
const editUserAvatar = require('./editUserAvatar');
const editUserData = require('./editUserData');
const editUserPassword = require('./editUserPassword');
const userProducts = require('./userProducts');
const getPrivateUser = require('./getPrivateUser');

module.exports = {
    newUser,
    validateUser,
    loginUser,
    editUser,
    deleteUser,
    getPublicUser,
    editUserAvatar,
    editUserData,
    editUserPassword,
    userProducts,
    getPrivateUser,
};
