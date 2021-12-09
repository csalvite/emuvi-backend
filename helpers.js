/* 
    Funciones de ayuda
*/
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const path = require('path');
const uuid = require('uuid');
const sharp = require('sharp');
const { ensureDir, unlink } = require('fs-extra');
const fs = require('fs');

//Importar las variables de entorno necesarias
const {
  SENDGRID_API_KEY,
  SENDGRID_FROM,
  PUBLIC_HOST,
  UPLOADS_DIRECTORY,
  EMAIL_PHOTOS_DIRECTORY,
} = process.env;

// Creamos la ruta absoluta al directorio de subida de ficheros.
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);
const emailImages = path.join(__dirname, EMAIL_PHOTOS_DIRECTORY);

// Para añadir la imagen al correo necesitamos tenerla en base64 - Funcion que devuelve el base64:
const emailPathImage = path.join(
  __dirname,
  EMAIL_PHOTOS_DIRECTORY + '/OfertaDeCompra.jpg'
);

function imgToBase64(url) {
  const dataurl = fs.readFileSync(url);

  return dataurl.toString('base64');
}

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
  const emailBody = `
  <h2> Te acabas de registrar en EMUVI </h2>
  <p> Pulsa el siguiente enlace para verificar tu cuenta: ${PUBLIC_HOST}/users/register/${registrationCode} </p>
  
  <img src="${imgToBase64(emailPathImage)}" />`;

  //Enviamos el mensaje al correo del usuario.
  await sendMail({
    to: email,
    subject: 'Activa tu cuenta',
    body: emailBody,
    html: `
    <img src="data:image/jpeg;base64,${imgToBase64(emailPathImage)}" />    
    `,
  });
}

/**
 * #################
 * ## nuevaOferta ##
 * #################
 */

async function newOffer({ email, userBuyer, productName, idUser }) {
  const emailBody = `
    <p> El usuario ${userBuyer} quiere comprar tu producto ${productName}!<p>
    <p> Puedes gestionar tus ofertas a través del siguiente enlace: </p>
    <p> ${PUBLIC_HOST}/users/${idUser}/ </p>
  `;

  await sendMail({
    to: email,
    subject: 'Tienes una nueva oferta!',
    body: emailBody,
  });
}

/**
 * ####################
 * ## ofertaAceptada ##
 * ####################
 */

async function offerAccepted({
  email,
  sellerUser,
  productName,
  street,
  time,
  date,
  idUser,
}) {
  const emailBody = `
    <p> El usuario ${sellerUser}, propietario del producto ${productName}, ha aceptado tu propuesta de compra </p>
    <p> La compra se realizará en: <strong>${street}</strong> a las <strong>${time}</strong> el día ${date} </p>
    <p> No llegues tarde! </p>
    <p> Tienes más información en tu perfil, apartado "Ofertas Enviadas": ${PUBLIC_HOST}/users/${idUser}/ </p>
  `;

  await sendMail({
    to: email,
    subject: 'Oferta de Compra Aceptada!',
    body: emailBody,
  });
}

/**
 * ####################
 * ## ofertaDenegada ##
 * ####################
 */

async function offerDenied({ email, sellerUser, productName }) {
  const emailBody = `
    <p> Lamentamos comunicarte que el usuario ${sellerUser} ha denegado la compra del producto ${productName}. </p>
    <p> Pero no te preocupes, hay más productos en nuestro catálogo a la espera! </p>
    <p> ${PUBLIC_HOST}/products </p>
  `;

  await sendMail({
    to: email,
    subject: 'Oferta de compra Denegada :(',
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
    // Creamos la ruta absoluta de la foto
    const photoPath = path.join(uploadsDir, photoName);

    // Eliminamos la imagen de la ruta
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
    // Comprobamos que el directorio de subida de imágenes existe
    await ensureDir(uploadsDir);

    // Convertimos la imagen en objeto sharp
    const sharpImage = sharp(image.data);

    const imageInfo = await sharpImage.metadata();

    // Comprobamos el tipo de imagen pasado: 0 avatar ! 1 imagen para productos
    if (type === 0) {
      sharpImage.resize(150, 150);
    } else if (type === 1 && imageInfo.width > 1000) {
      // Solo en caso de ser imagen para producto y mayor de 1000px la redimensionamos
      sharpImage.resize(1000, 1000);
    }

    // Generamos un nombre único para la imagen
    const imageName = uuid.v4() + '.jpg'; // tenemos que añadirle el .jpg por el rollo avatar

    // Creamos ruta absoluta a la nueva ubicación de la imagen para guardarla
    const imagePath = path.join(uploadsDir, imageName);

    // Guardamos la imagen
    await sharpImage.toFile(imagePath);

    return imageName;
  } catch (_) {
    throw new Error('Error al procesar la imagen');
  }
}

/**
 * ##############
 * ## validate ##
 * ##############
 */
async function validate(schema, data) {
  try {
    await schema.validateAsync(data);
  } catch (error) {
    error.httpStatus = 400;
    throw error;
  }
}

module.exports = {
  generateRandomString,
  sendMail,
  verifyEmail,
  deletePhoto,
  savePhoto,
  validate,
};
