const { getConnection } = require("../../DB/db");
const {generateError} = require("../../helpers");

async function deleteUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    //Validar la información del body según los esquemas
    
    const { id } = req.params;
  
    // Comprobar que el id de usuario que queremos cambiar es el mismo que firma la petición 
    if (req.auth.id !== Number(id)) {
      throw generateError("No tienes permisos para eliminar este usuario", 403);
    }

    // Comprobar que el usuario existe
    const [currentUser] = await connection.query(
      `SELECT id, email, avatar
      FROM usuarios
      WHERE id=?`,
      [id]
    );

    if (currentUser.length === 0) {
      throw generateError(`El usuario con id ${id} no existe`, 404);
    }
    await connection.query(
        `DELETE  FROM usuarios
        WHERE id=?`,
        [id]
      );

      // Dar una respuesta
      res.send({
        status: "ok",
        message: "Usuario eliminado",
      });
    
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteUser;