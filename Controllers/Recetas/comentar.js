const { getConnection } = require("../../DB/db");
const { newComentarioSchema } = require("../../Schemas/Recetas/schemasRecetas");

async function comentarReceta (req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    
   await newComentarioSchema.validateAsync(req.body.comentario)
    const { id } = req.params;
    const { comentario } = req.body;
    // if ( comentario.length < 20 || comentario.length > 1000) {
    //   throw generateError('El campo comentario debe tener un valor entre 20 y 1000 caracteres (incluídos)', 400);
    // }
    
    // Comprobar que la entrada existe y si no dar un 404
    const [entry] = await connection.query(
      `SELECT id
      FROM recetas
      WHERE id=?`,
      [id]
    );

    // Guardar el comentario en la base de datos
    await connection.query(
        `INSERT INTO comentarios(id_receta, id_usuario, texto, created_at)
        VALUES(?, ?, ?, UTC_TIMESTAMP)`,
        [id, req.auth.id, comentario]
    );

    res.send({
      status: "ok",
      message: `Se guardó el comentario a la receta ${id}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = comentarReceta;
