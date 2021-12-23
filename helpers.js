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

// Para añadir la imagen al correo necesitamos tenerla en base64 - Funcion que devuelve el base64:
const emailPathImage = path.join(
    __dirname,
    EMAIL_PHOTOS_DIRECTORY + '/BienvenidoEMUVI.png'
);

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
            html: `<html>
                    <body>
                      <div style="text-align: center;">
                        <h1>${subject}</h1>
                        <p>${body}</p>
                      </div>
                    </body>
                  </html>`,
        };

        //enviamos el mensaje.
        await sgMail.send(msg);
    } catch (_) {
        throw new Error('Hubo un problema al enviar el email');
    }
}

/**
 * #################
 * ## changeEmail ##
 * #################
 */

async function changeEmail(email, registrationCode) {
    const emailBody = `
    <h2> Confirmación de cambio de correo </h2>
    <p> Pulsa en el siguiente enlace para activar tu cuenta con el nuevo correo proporcionado ${PUBLIC_HOST}/users/mail/${registrationCode} </p>
    `;

    await sendMail({
        to: email,
        subject: 'Activa tu cuenta',
        body: emailBody,
    });
}

/**
 * #################
 * ## verifyEmail ##
 * #################
 */

async function verifyEmail(email, registrationCode) {
    const emailBody = `
  <h2> Te acabas de registrar en EMUVI </h2>
  <p> Pulsa sobre la imagen o en el siguiente enlace para verificar tu cuenta: ${PUBLIC_HOST}/users/register/${registrationCode} </p>
  <a href=${PUBLIC_HOST}/users/register/${registrationCode}><img src="https://i.ibb.co/gVYWWKb/Bienvenido-EMUVI.png" alt="Bienvenido-EMUVI" width="500" border="0"></a>
  `;

    //Enviamos el mensaje al correo del usuario.
    await sendMail({
        to: email,
        subject: 'Activa tu cuenta',
        body: emailBody,
    });
}

/**
 * #################
 * ## nuevaOferta ##
 * #################
 */

async function newOfferMail(email, userBuyer, productName, idUser) {
    const emailBody = `
        <p> El usuario <strong>${userBuyer}</strong> quiere comprar tu producto <strong>${productName}</strong>!<p>
        <p> Puedes gestionar tus ofertas a través del siguiente enlace o pinchando sobre la imagen: </p>
        <p> ${PUBLIC_HOST}/users/${idUser}/offers </p>
        <a href=${PUBLIC_HOST}/users/${idUser}/offers><img src="https://i.ibb.co/c23zp3h/Email-oferta-de-compra.png" alt="Email_oferta_de_compra" border="0"></a>
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

async function offerAccepted(
    email,
    sellerUser,
    productName,
    street,
    city,
    time,
    date,
    idUser
) {
    const emailBody = `
    <p> El usuario ${sellerUser}, propietario del producto ${productName}, ha aceptado tu propuesta de compra </p>
    <p> La compra se realizará en: <strong>${street}, ${city}</strong> a las <strong>${time}</strong> el día <strong>${date}</strong> </p>
    <p> No llegues tarde! </p>
    <p> Tienes más información en tu perfil, apartado "Ofertas Enviadas": ${PUBLIC_HOST}/users/${idUser}/ </p>
    <a href=${PUBLIC_HOST}/users/${idUser}><img src="https://i.ibb.co/LNkCc8B/Email-propuesta-aceptada.png" alt="Email-propuesta-aceptada" width="500" border="0"></a>
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

async function offerDeniedMail(email, sellerUser, productName) {
    const emailBody = `
    <p> Lamentamos comunicarte que el usuario ${sellerUser} ha denegado la compra del producto ${productName}. </p>
    <p> Pero no te preocupes, hay más productos en nuestro catálogo a la espera! </p>
    <p> Pulsa sobre la imagen o en el siguiente enlace para ver nuestro catálogo de productos en venta: ${PUBLIC_HOST}/products </p>
    <a href=${PUBLIC_HOST}/products><img src="https://i.ibb.co/N34VyFd/Email-propuesta-rechazada.png" alt="Email-propuesta-rechazada" width="500" border="0"></a>
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
    changeEmail,
    newOfferMail,
    offerAccepted,
    offerDeniedMail,
    deletePhoto,
    savePhoto,
    validate,
};
