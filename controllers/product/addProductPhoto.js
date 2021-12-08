const getDB = require('../../database/getDB');
const { savePhoto } = require('../../helpers');
const addProductPhoto = async (req, res, next) => {
    let connection;
try {
     connection = await getDB();
    const { idProduct } = req.params;
    //Si no hay foto, casca
    
} catch (error) {
    
}