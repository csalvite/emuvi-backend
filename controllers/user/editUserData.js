const getDB = require('../../database/getDB');

const editUserData = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { idUser } = req.params;

        const {
            name,
            lastname,
            biography,
            birthday,
            street,
            province,
            city,
            postalCode,
        } = req.body;

        // if (!(name && lastname)) {
        //   const error = new Error(
        //     'Debes indicar al menos los datos marcados como obligatorios'
        //   );
        //   error.httpStatus = 409;
        //   throw error;
        // }

        // Actualizaremos los campos que el usuario cubra en el formulario
        await connection.query(
            `UPDATE user
       SET name = ?,
           lastname = ?,
           biography = ?,
           birthday = ?,
           street = ?,
           province = ?,
           city = ?,
           postalCode = ?
           WHERE id = ?
            `,
            [
                name,
                lastname,
                biography,
                birthday,
                street,
                province,
                city,
                postalCode,
                idUser,
            ]
        );

        res.send({
            status: 'OK',
            message: 'Datos de usuario modificados con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUserData;
