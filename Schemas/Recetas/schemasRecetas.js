const Joi = require ('joi');
const { generateError } = require("../../helpers");

//Esquema de validación de nueva entrada.
const newRecetaSchema = Joi.object().keys({
    titulo: Joi.string()
    .min(2)
    .max(50)
    .required()
    .error(
      generateError(
        "El campo titulo debe existir y ser mayor de dos caracteres",
          400
      )
    ),
    descripcion: Joi.string()
    .min(100) 
    .max(30000)
    .required()
    .error(
      generateError(
        "El campo descripcion debe existir y ser mayor de cien caracteres",
          400
      )
    ),
    pasos: Joi.string()
    .min(50)
    .max(1000)
    .required()
    .error(
      generateError(
        "El campo pasos debe existir y ser mayor de cincuenta caracteres",
          400
      )
    ),
    ingredientes:Joi.string()
    .min(2)
    .max(1000)
    .required()
    .error(
      generateError(
        "El campo ingredientes debe existir y ser mayor de dos caracteres",
          400
      )
    ),
    cuberteria: Joi.string()
      .min(2)
      .max(250)
      .required()
      .error(
        generateError(
          "El campo cuberteria  debe existir y ser mayor de dos caracteres",
          400
        )
    ),
    tiempo_preparacion: Joi.string()
    .min(1)
    .max(250)
    .required()
    .error(
      generateError(
        "El campo tiempo de preparación debe existir y ser mayor de dos caracteres",
        400
      )
  )
});
//Esquema validación de nuevo comentario.
const newComentarioSchema = Joi.string()
      .min(20)
      .max(1000)
      .required()
      .error(
        generateError(
          "El campo comentario debe existir y ser mayor de 20 caracteres",
          400
        )
    );
  

module.exports = {
    newRecetaSchema,
    newComentarioSchema,
}