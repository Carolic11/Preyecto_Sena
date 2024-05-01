const express = require("express");

const mysql = require("mysql2");

const app = express();

let conexion =mysql.createConnection ({
    host: "localhost",
    database:"login",
    user: "root",
    password: ""
});

app.set("view engine","ejs");

app.use(express.static('public'));


app.listen(3000, function () {
    console.log("Servidor iniciado en http://localhost:3000");
});

app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.get("/",function(req,res){
    res.render("index");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/mostrarDatos",function(req,res){
    res.render("mostrarDatos");
});

app.get("/index",function(req,res){
    res.render("index");
});

app.get("/experto",function(req,res){
    res.render("experto");
});

app.get("/servicios",function(req,res){
    res.render("servicios");
});
app.post("/validar",function (req, res) {
    const dato = req.body;
    let nombre = dato.name;
    let direccion = dato.direccion;
    let telefono = dato.telefono;
    let email = dato.emai; 
    let password = dato.pass;

    console.log(nombre + direccion + telefono + email + password);

    let buscar = "SELECT * FROM login_us WHERE email = ?";
    conexion.query(buscar, [email], function (error, row) {
        if (error) {
            throw error;
        } else {
            if (row.length > 0) {
                console.log("Usuario encontrado, Iniciando sesión");
                // comprobar la contraseña aquí
                if (row[0].password === password) {
                    console.log("Inicio de sesión exitoso");
                      res.redirect("servicios"); 
                    // iniciar sesión y redirigir a la página principal aquí
                } else {
                    console.log("Contraseña incorrecta");
                }
            } else {
                console.log("Usuario no existe, Regístrese");
            }
        }
    });
});

app.post("/registro", function (req, res) {
    const dato = req.body;
    let nombre = dato.name;
    let direccion = dato.direccion;
    let telefono = dato.telefono;
    let email = dato.correo; 
    let password = dato.pass;

    console.log(nombre + direccion + telefono + email + password);

    let busca = "SELECT * FROM login_us WHERE email = ?";
    conexion.query(busca, [email], function (error, row) {
        if (error) {
            throw error;
        } else {
            if (row.length > 0) {
                console.log("Usuario encontrado, Iniciando sesión");
            }else {
                console.log("Usuario no existe, Regístrese");
                let insertar = "INSERT INTO login_us (nombre,direccion,telefono,email, password) VALUES ('" + nombre + "','" + direccion + "','" + telefono + "','" + email + "','" + password + "')";
                conexion.query(insertar, function (error, result) {
                    if (error) {
                        console.error("Error al insertar usuario:", error);
                        res.status(500).send("Error al registrar el usuario");
                    } else {
                        console.log("Usuario registrado exitosamente");
                        res.redirect("/"); 
                   }
                });
            }
             
        }
    });

});

app.post("/sugerencia",function (req, res) {
    const datos = req.body;

    let correo = datos.mai;
    let sugerencias = datos.sug;
 
    console.log(correo+sugerencias);

    let inserta = "INSERT INTO sugerencias (correo, sugerencias) VALUES ('" + correo + "','" + sugerencias + "')";
                conexion.query(inserta, function (error, result) {
                    if (error) {
                        console.error("Error al insertar sugerencia:", error);
                        res.status(500).send("Error al registrar el sugerencia");
                    } else {
                        console.log("Se inserta sugerencia");
                        res.redirect("/"); 
                   }
                });

});


// Función para realizar la consulta a la base de datos
const queryFromDatabase = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM login_us'; // Modifica 'tabla' por el nombre de tu tabla real

        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error al realizar la consulta:', error);
                return reject(error);
            }
            resolve(results);
        });
    });
};

// En tu ruta de Express
app.get('/mostrarDatos', async (req, res) => {
    try {
        const data = await queryFromDatabase(); // Obtener datos de la base de datos

        res.render('mostrarDatos', { data }); // Renderizar la vista EJS y pasar los datos
    } catch (error) {
        res.status(500).send('Error al obtener los datos');
    }
});