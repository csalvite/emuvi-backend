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
                return new Error('El nombre es requerido');
            }

            return new Error(
                'El nombre debe tener entre 3 y 50 caracteres. Solo puede contener letras o números.'
            );
        }),
    price: Joi.number()
        .required()
        .min(1)
        .max(10000)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('la propiedad [price] es requerida');
            }
            return new Error(
                'Solo se aceptan precios entre 1€ y 99999€. Solo puede ser numerica'
            );
        }),

    description: Joi.string()
        .required()
        .min(10)
        .max(300)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                case 'string.emty':
                    return new Error('La propiedad [description] es requerida');

                default:
                    return new Error(
                        'La propiedad [description] debe tener entre 10 y 300 caracteres.'
                    );
            }
        }),
    category: Joi.string()
        .required()
        .min(4)
        .max(20)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                case 'string.emty':
                    return new Error('La propiedad [category] es requerida');

                default:
                    return new Error(
                        'Debes elegir una categoría entre las dispuestas.'
                    );
            }
        }),
});

module.exports = newProductSchema;
