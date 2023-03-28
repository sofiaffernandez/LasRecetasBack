const jsonwebtoken = require("jsonwebtoken");
const { getConnection } = require("../DB/db");

async function esAdmin(req, res, next) {
    let connection;
  
    try {
      connection = await getConnection();
  
      // Extraer token de los headers de la petición
      const { authorization } = req.headers;
  
      if (!authorization) {
        const error = new Error("Falta la cabecera de autorización");
        error.httpStatus = 401;
        throw error;
      }
  
      // Comprobar que el token es válido
      // y decodificar el contenido del token
      let tokenInfo;
      try {
        tokenInfo = jsonwebtoken.verify(authorization, process.env.SECRET);
      } catch (error) {
        const tokenError = new Error("El token no es válido");
        tokenError.httpStatus = 401;
        throw tokenError;
      }
  
      // Obtener el campo admin del usuario
      const [result] = await connection.query(
        `
        SELECT admin
        FROM usuarios
        WHERE id=?
      `,
        [tokenInfo.id]
      );
  
      if (result.length === 0) {
        const error = new Error("El usuario no existe en la base de datos");
        error.httpStatus = 401;
        throw error;
      }
  
      if (!result[0].admin) {
        const error = new Error("Acceso denegado");
        error.httpStatus = 401;
        throw error;
      }
  
      // Meter ese contenido en el objeto de petición para futuro uso
      req.auth = tokenInfo;
  
      // Pasar al siguiente middleware
      next();
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = esAdmin;
  