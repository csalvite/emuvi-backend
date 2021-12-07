/* 
    Funciones de ayuda
*/
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const path = require('path');

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

module.exports = {
  generateRandomString,
  sendMail,
  verifyEmail,
  deletePhoto,
};
