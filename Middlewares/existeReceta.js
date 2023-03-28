const { getConnection } = require("../DB/db");
async function existeReceta(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    // Comprobar que la entrada que queremos editar exista en la base de datos
    const [current] = await connection.query(
      `SELECT id
    FROM recetas
    WHERE id=?`,
      [id]
    );

    if (current.length === 0) {
      throw generateError(
        `La receta con id ${id} no existe en la base de datos`,
        404
      );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = existeReceta;