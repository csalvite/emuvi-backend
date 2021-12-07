/* 
    Funciones de ayuda
*/
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const path = require('path');
const uuid = require('uuid');
const { ensureDir, unlink } = require('fs-extra');

//Importar las variables de entorno necesarias
const { SENDGRID_API_KEY, SENDGRID_FROM, PUBLIC_HOST, UPLOADS_DIRECTORY } =
  process.env;

// Creamos la ruta absoluta al directorio de subida de ficheros.
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

//Asignamos el API Key a Sendgrind.
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * ##########################
 * ## generateRandomString ##
 * ##########################
 */

function generateRandomString(leght) {
  return crypto.randomBytes(leght).toString('hex');
}

/**
 * ##############
 * ## sendMail ##
 * ##############
 */

async function sendMail({ to, subject, body }) {
  try {
    //Preprar el mensaje
    const msg = {
      to,
      from: SENDGRID_FROM,
      subject,
      text: body,
      html: `<div>
                    <h1>${subject}</h1>
                    <p>${body}</p>
            </div>`,
    };

    //enviamos el mensaje.
    await sgMail.send(msg);
  } catch (_) {
    throw new Error('Hubo un problema al enviar el email');
  }
}

/**
 * #################
 * ## verifyEmail ##
 * #################
 */

async function verifyEmail(email, registrationCode) {
  const emailBody = `Te acabas de registrar en EMUVI pulsa el siguiente link para verificar tu cuenta: ${PUBLIC_HOST}/users/register/${registrationCode}`;

  //Enviamos el mensaje al correo del usuario.
  await sendMail({
    to: email,
    subject: 'Activa tu cuenta',
    body: emailBody,
  });
}

/**
 * #################
 * ## deletePhoto ##
 * #################
 */

async function deletePhoto(photoName) {
  try {
    // Creamos la ruta absoluta de la foto.
    const photoPath = path.join(uploadsDir, photoName);

    // Eliminamos la foto del disco.
    await unlink(photoPath);
  } catch (_) {
    throw new Error('Error al eliminar la imagen del servidor');
  }
}
/**
 * ###############
 * ## savePhoto ##
 * ###############
 */
async function savePhoto(image, type) {
  try {
    // Comprobamos que el directorio de subida de imágenes exista.
    await ensureDir(uploadsDir);

    // Convertimos la imagen en un objeto "Sharp".
    const sharpImage = sharp(image.data);

    // Accedemos a los metadatos de la imagen para posteriormente comprobar
    // el ancho total.
    const imageInfo = await sharpImage.metadata();

    // Si el tipo de imagen es 0 (avatar) redimensionamos la imagen a 150x150.
    if (type === 0) {
      sharpImage.resize(150, 150);
    }

    // Si la imagen es de tipo 2 (entrada) y el ancho supera el máximo indicado
    // redimensionamos la imagen.
    else if (type === 1 && imageInfo.width > 1000) {
      sharpImage.resize(1000);
    }

    // Generamos un nombre único para la imagen.
    const imageName = `${uuid.v4()}.jpg`;

    // Creamos la ruta absoluta a la ubicación donde queremos guardar la imagen.
    const imagePath = path.join(uploadsDir, imageName);

    // Guardamos la imagen en el directorio "uploads".
    await sharpImage.toFile(imagePath);

    // Retornamos el nombre del fichero.
    return imageName;
  } catch (_) {
    throw new Error('Error al procesar la imagen');
  }
}

module.exports = {
  generateRandomString,
  sendMail,
  verifyEmail,
  deletePhoto,
  savePhoto,
};
