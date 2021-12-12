//app.get('/user/:id/votes/:idvotes')
const getDB = require('../../database/getDB');

const editVote = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { idUser } = req.params;
        const [userexits] = await connection.query(`SELECT * FROM user WHERE id =?`, [idUser]);
        if (userexits.length < 1) {
            const error = new Error('El usuario con id ${id} no existe').
        }
    } catch (error) {
        
    }