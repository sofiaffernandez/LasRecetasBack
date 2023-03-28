const { getConnection } = require("../../DB/db");
const { deleteUpload, generateError } = require("../../helpers");

async function borrarReceta(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;

    // Comprobar que existe esa id y si no dar error404
    const [current] = await connection.query(
      `SELECT autor_id
      FROM recetas
      WHERE id=? `,
      [id]
    );
  //Comprobar que el usuario que intenta borrar es el que la creo
    if (current[0].autor_id !== req.auth.id) {
      throw generateError("No tienes permisos para borrar esta entrada", 403);
    }

    // Borrar la recomendación de la tabla
    await connection.query(
      `DELETE FROM recetas
      WHERE id=?`,
      [id]
    );

    // Seleccionar posibles imagenes asociadas
    const [images] = await connection.query(
      `SELECT foto
      FROM imagenes
      WHERE id_receta=?`,
      [id]
    );

    // Borra los ficheros
    for (const image of images) {
      await deleteUpload(image.foto);
    }

    // Borrar imágenes de la tabla
    await connection.query(
      `DELETE FROM imagenes
      WHERE id_receta=?`,
      [id]
    );

    // Borrar comentarios asociados a esa entrda en la tabla comentarios
    await connection.query(
      `DELETE FROM comentarios
      WHERE id_receta=?`,
      [id]
    );
    res.send({
      status: "ok",
      message: `La receta con id:${id} fue borrada y también sus comentarios e imágenes`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = borrarReceta;