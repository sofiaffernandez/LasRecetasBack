require("dotenv").config();

const { getConnection } = require("./db");

let connection;

async function main() {
  try {
    // Conseguir conexión a la base de datos
    connection = await getConnection();

    // Borrar las tablas si existen 
    console.log("Borrando tablas");
    await connection.query("DROP TABLE IF EXISTS usuarios");
    await connection.query("DROP TABLE IF EXISTS recetas");
    await connection.query("DROP TABLE IF EXISTS comentarios");
    await connection.query("DROP TABLE IF EXISTS favoritos");
    await connection.query("DROP TABLE IF EXISTS ingredientes");
    await connection.query("DROP TABLE IF EXISTS ingredientes_en_recetas");
    await connection.query("DROP TABLE IF EXISTS lista_compras");


    // Crear las tablas de nuevo
  
    // Tabla usuarios:
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INT PRIMARY KEY,
        nombre VARCHAR(50),
        email VARCHAR(50),
        contrasena VARCHAR(512),
        avatar VARCHAR(500),
        created_at DATETIME NOT NULL,
        eliminado BOOLEAN DEFAULT false,
        admin BOOLEAN DEFAULT false
      );
    `);
  
    // Tabla usuarios:
    await connection.query(`
    CREATE TABLE IF NOT EXISTS recetas (
        id_receta INT PRIMARY KEY,
        titulo VARCHAR(50),
        descripcion TEXT,
        pasos TEXT,
        ingredientes TEXT,
        cuberteria VARCHAR(255),
        tiempo_preparacion INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        autor_id INTEGER,
	    FOREIGN KEY (autor_id) REFERENCES usuarios (id_usuario)
        );
    `);
    await connection.query(`
    CREATE TABLE imagenes (
        id_imagen INT PRIMARY KEY,
        id_receta INT,
        imagen VARCHAR(255),
        FOREIGN KEY (id_receta) REFERENCES recetas(id_receta)
        );
    `)
     

     // Tabla usuarios:
     await connection.query(`
     CREATE TABLE IF NOT EXISTS comentarios (
        id_comentario INT PRIMARY KEY,
        id_receta INT,
        id_usuario INT,
        texto TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_receta) REFERENCES recetas(id_receta),
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        );
   `);
    // Tabla usuarios:
    await connection.query(`
    CREATE TABLE IF NOT EXISTS favoritos (
        id_favorito INT PRIMARY KEY,
        id_receta INT,
        id_usuario INT,
        FOREIGN KEY (id_receta) REFERENCES recetas(id_receta),
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        );
    `);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS ingredientes (
        id_ingrediente INT PRIMARY KEY,
        nombre VARCHAR(50),
        cantidad INT,
        unidad VARCHAR(50)
        );
    `);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS ingredientes_en_recetas (
        id_ingrediente INT,
        id_receta INT,
        cantidad INT,
        FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id_ingrediente),
        FOREIGN KEY (id_receta) REFERENCES recetas(id_receta)
        );
    `);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS lista_compras (
        id_elemento_lista INT PRIMARY KEY,
        id_usuario INT,
        id_ingrediente INT,
        cantidad INT,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
        FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id_ingrediente)
        );
    `);

  
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Todo hecho, liberando conexión");
    if (connection) connection.release();
    process.exit();
  }
}

main();