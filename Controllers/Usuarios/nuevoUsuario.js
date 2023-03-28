const { getConnection } = require("../../DB/db");
const { generateError } = require("../../helpers");
const { newUserSchema } = require("../../Schemas/Usuarios/schemasUsuarios");

async function newUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    //Validar el usuario según el esquema
    await newUserSchema.validateAsync(req.body);

    const { nombre, email, contraseña } = req.body;

    // comprobar que no existe un usuario con ese mismo email en la base de datos
    const [existingUser] = await connection.query(
      `SELECT id_usuario 
      FROM usuarios
      WHERE email=?`,
      [email]
    );

    if (existingUser.length > 0) {
      throw generateError(
        "Ya existe un usuario en la base de datos con ese email",
        409
      );
    }

  
// meter el nuevo usuario en la base de datos 
    await connection.query(
      `INSERT INTO usuarios(nombre, email, contrasena, created_at)
      VALUES(?, ?, SHA2(?, 512), UTC_TIMESTAMP)`,
      [nombre, email, contraseña]
    );
    res.send({
      status: "ok",
      message:
        "Usuario registrado."
     
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;
