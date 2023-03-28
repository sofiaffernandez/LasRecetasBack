const { getConnection } = require("../../DB/db");

async function verDetalleUsuario (req, res, next) {
    let connection;
    try {
      connection = await getConnection();
    const { id } = req.params;

    
    //Selecionar datos usuario creador
    const datosUsuario = await connection.query (
      `SELECT *
        FROM usuarios
        WHERE id_usuario=?`,
        [id]
)
      // seleccionar recomendaciones
        const datosRecetasUsuario = await connection.query (
          `   SELECT recetas.*
          FROM recetas
          INNER JOIN usuarios
          ON recetas.autor_id = usuarios.id_usuario
          WHERE usuarios.id_usuario= ?`,
            [id]
    )
     // seleccionar comentarios
     const datosComentariosUsuarios = await connection.query (
        `SELECT comentarios.*
        FROM comentarios
        INNER JOIN usuarios on usuarios.id_usuario = comentarios.id_usuario
        WHERE usuarios.id_usuario = ?`,
          [id]
  )
  


  
    const detalle  = { datosUsuario, datosRecetasUsuario, datosComentariosUsuarios }
  
    res.send({
        status: "ok",
        data: { detalle,
            datosRecetasUsuario, datosUsuario, datosComentariosUsuarios
        },
    });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = verDetalleUsuario;
