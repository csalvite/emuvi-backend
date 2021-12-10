const Joi = require('joi');

const newProductSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .min(3)
    .max(50)
    .regex(/[A-Za-z0-9 ]/)
    .error((errors) => {
      if (
        errors[0].code === 'any.required' ||
        errors[0].code === 'string.empty'
      ) {
        return new Error('La propiedad [name] es requerida');
      }

      return new Error(
        'La propiedad [name] debe tener entre 3 y 50 caracteres. Solo puede contener letras o números.'
      );
    }),
  price: Joi.number()
    .required()
    .min(1)
    .max(100)
    .error((errors) => {
      if (
        errors[0].code === 'any.required' ||
        errors[0].code === 'string.empty'
      ) {
        return new Error('la propiedad [price] es requerida');
      }
      return new Error(
        'La propiedad [price] debe tener entre 1 y 100 digitos. Solo puede ser numerica'
      );
    }),

  description: Joi.string()
    .required()
    .min(20)
    .max(500)
    .error((errors) => {
      switch (errors[0].code) {
        case 'any.required':
        case 'string.emty':
          return new Error('La propiedad [description] es requerida');

        default:
          return new Error(
            'La propiedad [description] debe tener entre 20 y 500 caracteres.'
          );
      }
    }),
});

module.exports = newProductSchema;
