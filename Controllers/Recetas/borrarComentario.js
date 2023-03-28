const { getConnection } = require("../../DB/db");
const { generateError } = require("../../helpers");

async function borrarComentarios(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;

    // Comprobar que existe esa id y si no dar error404
    const [current] = await connection.query(
      `SELECT id_usuario
      FROM comentarios
      WHERE id=? `,
      [id]
    );

    if (current.length === 0) {
      throw generateError("No existe ese comentario", 404);
    }

    // Comprobar que el usuario que intenta borrar es el que la creó
    if (current[0].usuario_id !== req.auth.id) {
      throw generateError("No tienes permisos para borrar este comentario", 403);
    }

    // Borrar comentario 
    await connection.query(
      `DELETE
       FROM comentarios
      WHERE id=?`,
      [id]
    );

    res.send({
      status: "ok",
      message: `El comentario con id ${id} ha sido borrado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = borrarComentarios;
