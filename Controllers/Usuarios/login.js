const { getConnection } = require("../../DB/db");
const jsonwebtoken = require("jsonwebtoken");
const { generateError } = require("../../helpers");

const { loginUserSchema } = require("../../Schemas/Usuarios/schemasUsuarios");

async function loginUsuario(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //Validar que se reciben los datos necesarios
    await loginUserSchema.validateAsync(req.body);

    const { email, contraseña } = req.body;

    // Seleccionar el usuario de la base de datos y comprobar que las passwords coinciden
    const [dbUser] = await connection.query(
      `SELECT id
      FROM usuarios
      WHERE email=? AND contraseña=SHA2(?, 512)`,
      [email, contraseña]
    );

    if (dbUser.length === 0) {
      throw generateError(
        "No hay ningún usuario registrado con ese email o la password es incorrecta",
        401
      );
    }
    const id = dbUser[0].id
    // Generar token con información del usuario
    const tokenInfo = {
      id: dbUser[0].id
    };

    const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "30d",
    });

    // Devolver el token
    res.send({
      status: "ok",
      data: {
        token,
        id
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginUsuario;
