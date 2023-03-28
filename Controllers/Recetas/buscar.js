const { getConnection } = require("../../DB/db");

async function buscador(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Proceso los parámetros de búsqueda
    const { ingredientes, tiempo, titulo  } = req.query;


    let queryResults;

    // Búsqueda 
    if ( ingredientes || tiempo || titulo) {
      queryResults = await connection.query(
        `
        SELECT *, 
        FROM recetas 
        WHERE ingredientes LIKE ? OR tiempo LIKE ? OR titulo like ?
        GROUP BY recomendaciones.id 
        

        `,
        [ingredientes, tiempo, titulo]
      );
    
   
    }else if (!ingredientes && !tiempo && !titulo) {
        queryResults = await connection.query(
          `
          SELECT *, 
          FROM recetas 
          `,
        );
        }
    // Extraigo los resultados reales del resultado de la query
    const result = queryResults[0];

    // Mando la respuesta
    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = buscador;