const { getConnection } = require("../../DB/db");
const {
  randomString,
  sendMail,
  processAndSaveImage,
  generateError,
} = require("../../helpers");

const { editUserSchema } = require("../../Schemas/Usuarios/schemasUsuarios");

async function editUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    //Validar la información del body según los esquemas
    await editUserSchema.validateAsync(req.body);

    const { id } = req.params;
    const { email, nombre } = req.body;

    // Comprobar que el id de usuario que queremos cambiar es el mismo que firma la petición 
    if (req.auth.id !== Number(id)) {
      throw generateError("No tienes permisos para editar este usuario", 403);
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

    // Si mandamos imagen guardar avatar

    let savedFileName;

    if (req.files && req.files.avatar) {
      try {
        // Procesar y guardar imagen
        savedFileName = await processAndSaveImage(req.files.avatar);
      } catch (error) {
        throw generateError(
          "No se pudo procesar la imagen. Inténtalo de nuevo",
          400
        );
      }
    } else {
      savedFileName = currentUser[0].image;
    }
      // Actualizar usuario en la base de datos
      await connection.query(
        `UPDATE usuarios 
        SET nombre=?, email=?, avatar=?, ultimo_cambio_contraseña=UTC_TIMESTAMP
        WHERE id=?`,
        [nombre, email, savedFileName, id]
      );

      // Dar una respuesta
      res.send({
        status: "ok",
        message: "Usuario actualizado",
      });
    
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editUser;

