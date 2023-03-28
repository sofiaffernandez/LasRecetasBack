const { getConnection } = require("../../DB/db");

const listarTodasRecetas = async (req, res, next) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(`
      SELECT recetas.*, 
      FROM recetas 
      LEFT JOIN usuarios on recetas.autor_id = usuarios.id_usuario 
      LEFT JOIN imagenes on recetas.id_receta = imagenes.id_receta 
      LEFT JOIN comentarios on recetas.id_receta = comentarios.id_receta
      ORDER BY recetas.created_at DESC
      `);

      res.send({
        status: "ok",
        data: result,
      });
  
    }  catch (error) {
        next(error);
    }finally {
      if (connection) connection.release();
    }
  };
  module.exports = listarTodasRecetas