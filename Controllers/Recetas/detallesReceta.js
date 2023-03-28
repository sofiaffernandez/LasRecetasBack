const { getConnection } = require("../../DB/db");

async function verDetalle(req, res, next) {
    let connection;
    try {
      connection = await getConnection();
    const { id } = req.params;

    // Comprobar que la entrada existe y si no dar un 404

    const [entry] = await connection.query(
        `SELECT id_receta
        FROM recetas
        WHERE id_receta=?`,
        [id]
    );
      //Selecionar datos recomendacion
        const datosReceta = await connection.query (
          `SELECT *
            FROM recetas
            WHERE id_receta=?`,
            [id]
    )
    //Selecionar datos usuario creador
    const datosUsuario = await connection.query (
      `SELECT usuarios.*
        FROM usuarios
        INNER JOIN recetas
        ON usuarios.id= recetas.autor_id
        WHERE recetas.id_receta=?`,
        [id]
)
      // seleccionar fotos recomendacion
        const images = await connection.query (
            `SELECT *
            FROM images
            WHERE id_receta=?`,
            [id]
    )
  
      // selecionar comentarios recomendacion 
        const datosComentarios = await connection.query (
          `SELECT *
            FROM comentarios
            WHERE id_receta=?`,
            [id]
    )
  
    const detalle  = { datosReceta, datosUsuario,  images, datosComentarios }
  
    res.send({
        status: "ok",
        data: {
            detalle
        },
    });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = verDetalle;