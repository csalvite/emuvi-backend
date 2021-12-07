const getDB = require('../../database/getDB');
const { savePhoto } = require('../../helpers');

async function editUser(req, res, next) {
  let connection;
  try {
    connection = await getDB();
    const { idUser } = req.params;

    const { username, name, lastname, email, biography, birthday } = req.body;

    //comprobamos que siempre exista email y contraseña
    if (!password || !email)
      throw new Error('El nombre de usuario y el email son obligatorios');

    //comprobamos que no exista un usuario con el mismo email
    const [existuser] = await connection.query(
      `
            SELECT *
            FROM user
            WHERE email=? AND NOT id=?
            `,
      [email, idUser]
    );

    //comprobamos que el nuevo email no coincida con uno ya existente
    if (existingUser.length > 0)
      throw new Error('Ya existe un usuario con este email');

    //CAMBIO DE IMAGEN PERFIL
    //actualiza el perfil si incluye el avatar
    if (req.files) {
      let nameFile;
      try {
        nameFile = await savePhoto({
          file: req.files.avatar,
          directory: 'avatar',
        });
      } catch (error) {
        throw new Error('No se ha podido subir la imagen');
      }

      //actualiza los datos de usuario incluyendo el avatar
      await connection.query(
        `
            UPDATE user
            SET avatar=?,
                username=?,
                name=?,
                lastname=?,
                email=?,
                biography=?,
                birthday=?
            WHERE id=?
            `,
        [nameFile, username, name, lastname, email, biography, birthday, idUser]
      );

      //actualizar usuario si no cambia la img
    } else {
      await connection.query(
        `
            UPDATE user
            SET username=?,
                name =?,
                lastname =?,
                email=?,
                biography=?,
                birthday=?
            WHERE id=?
            `,
        [username, name, lastname, email, biography, birthday, idUser]
      );
    }

    res.send({
      status: 'OK',
      message: 'Datos de usuario modificados con éxito',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { editUserContact };
