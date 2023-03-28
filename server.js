const cors = require("cors");
const path = require("path");
// Módulo que carga las variables del archivo .env en las variables de entorno
require("dotenv").config({ path: path.join(__dirname, "./.env") });

// Módulo para la creación de servidor http.
// Definición de aplicación Express.
const express =require("express");
const app =express();


// MIddleware log de eventos de express.
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
// Log de peticiones a la consola
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use('/public', express.static('public'));


// Procesado de body tipo json
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Procesado de body tipo form-data
app.use(fileUpload());

app.use(cors({origin: 'http://localhost:3000'}))


  
//Middleware para comprobar si es usuario
const esAdim =require ("./Middlewares/esAdmin")
const esUsuario = require("./Middlewares/esUsuario")
const existeReceta = require("./Middlewares/existeReceta")

//Importar controllers
//Recetas
     //Borrar la receta
     const borrarReceta = require("./Controllers/Recetas/borrarReceta")
     //Comentar una receta
     const comentarReceta = require("./Controllers/Recetas/comentar")
     //borrar comentario 
     const borrarComentarios = require ("./Controllers/Recetas/borrarComentario")
     //Publicar una receta nueva
     const nuevaReceta = require("./Controllers/Recetas/crearReceta")
     //Listar todas las recetas
     const listarTodasRecetas = require ("./Controllers/Recetas/listarRecetas")
      //detalles recetas
    const verDetalle = require("./Controllers/Recetas/detallesReceta")
    //buscador recetas
    const buscador = require("./Controllers/Recetas/buscar")
    //edtar receta
    const editarReceta = require("./Controllers/Recetas/editarReceta")


//Usuarios
     //detalles usuarios
     const verDetalleUsuario = require("./Controllers/Usuarios/detalleUsuario")
    //Editar usuario (cambiar foto de perfil)
    const editarUsuario = require("./Controllers/Usuarios/editarUsuario")
    //Hacer login de un usuario ya registrado
    const loginUsuario = require("./Controllers/Usuarios/login")
    //Crear un nuevo usuario
    const nuevoUsuario = require("./Controllers/Usuarios/nuevoUsuario")
    //Cambiar la contraseña de un usuario ya registrado
    const cambioContraseña = require ("./Controllers/Usuarios/cambioContraseña");
    //Eliminar Usuario
    const deleteUser = require("./Controllers/Usuarios/eliminarUsuario");



// ENDPOINTS DE CONTENIDO 
//ANÓNIMO (no hace falta verifcar el usuario):
// Buscar recetas 
app.get("/recetas/buscar", buscador)
//Ver todas las recetas
app.get("/recetas", listarTodasRecetas)
// Ver detalle de una receta
app.get("/receta/:id", verDetalle) 
//Ver datos de un usuario
app.get("/usuario/:id", verDetalleUsuario )

// Login (con email y password)
app.post("/usuario/login", loginUsuario);
// Registro (nombre, email y password)
app.post("/usuario/crear", nuevoUsuario);


//Con Usuario:
// Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil)
app.put("/usuario/:id", esUsuario, editarUsuario);
//Gestión del perfil (cambio de contraseña)
app.post("/usuario/:id/contrasena", esUsuario,  cambioContraseña);
// Borrar usuario
app.delete("/usuario/:id", esUsuario, deleteUser );
// Publicar comentarios en las recetas
app.post("/receta/:id/comentar", esUsuario, existeReceta, comentarReceta);
// Borrar comentario
app.delete("/comentario/:id", esUsuario, existeReceta, borrarComentarios);


// Solo administrador
//Crear recetas
app.post("/receta/crear", esAdim, nuevaReceta);
//Editar recetas
app.put("/recetas/:id/editar", esAdim, existeReceta, editarReceta)
// Borrar sus recetas
app.delete("/recomendacion/:id", esAdim, existeReceta, borrarReceta);


//Middleware 
app.use ((error, req, res, next) =>{
    console.error (error);
    res.status(error.httpStatus || 500).send({
        status:"error",
        message:error.message,
    })
})
//No existe
app.use ((req, res) => {
  res.status(404).send({
  status: "error",
  message: "Not found",
  });
});

const port = process.env.PORT;


app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port} `);
});

