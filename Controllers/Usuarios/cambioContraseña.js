const { getConnection } = require("../../DB/db");

const { generateError } = require("../../helpers");

const { editUserPasswordSchema } = require("../../Schemas/Usuarios/schemasUsuarios");

async function cambioContraseña(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
//Validamos según esquema
    await editUserPasswordSchema.validateAsync(req.body);

    const { id } = req.params; //Importante: esto va a ser un string
    const { viejaContrasena, nuevaContrasena } = req.body;

    // Comprobar que el usuario que hace la petición es el mismo que quiere cambiar la pass
    if (req.auth.id !== Number(id)) {
      throw generateError("No puedes cambiar la password de otro usuario", 403);
    }

    // Comprobar que el usuario existe  y que la password antigua es la correcta
    const [currentUser] = await connection.query(
      `
      SELECT id
      FROM usuarios
      WHERE id=? AND contraseña=SHA2(?, 512)
    `,
      [id, viejaContrasena]
    );

    if (currentUser.length === 0) {
      throw generateError("Tu password antigua no es correcta", 401);
    }

    // Guardar nueva password
    await connection.query(
      `
      UPDATE usuarios
      SET contraseña=SHA2(?, 512),  ultimo_cambio_contraseña=UTC_TIMESTAMP
      WHERE id=?
    `,
      [nuevaContrasena, id]
    );

    // Dar una respuesta
    res.send({
      status: "ok",
      message: "Password actualizada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = cambioContraseña;
