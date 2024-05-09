import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use('/bootstrap',express.static(`${__dirname}/node_modules/bootstrap/dist/css`));

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link href="/bootstrap/bootstrap.css" rel="stylesheet">
    </head>
    <body>
      
    <div class="container">
    <h1>Deportes</h1>
    </div>
    <div class="container pt-5">
        <h2>Agregar Deporte</h2>
        <form action="http://localhost:3000/nuevo">
            <div class="mb-3" >
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" name="nombre" id="nombre" class="form-control">
            </div>
            <div class="mb-3" >
                <label for="precio" class="form-label">Precio</label>
                <input type="text" name="precio" id="precio" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Agregar</button>
        </form>
    </div>
    <hr>
    <div class="container">
        <h2>Mostrar deportes registrados</h2>
        <form action="http://localhost:3000/deportes">
        <button type="submit" class="btn btn-primary">Agregar</button>
        </form>
    </div>
    <hr>
    <div class="container">
        <h2>Modificar precio de un deporte</h2>
        <form action="http://localhost:3000/modificar">
            <div class="mb-3" >
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" name="nombre" id="nombre" class="form-control">
            </div>
            <div class="mb-3" >
                <label for="precio" class="form-label">Precio</label>
                <input type="text" name="precio" id="precio" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Modificar</button>
        </form>
    </div>
    <hr>
    <div class="container">
        <h2>Eliminar un deporte</h2>
        <form action="http://localhost:3000/eliminar">
            <div class="mb-3" >
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" name="nombre" id="nombre" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Eliminar</button>
        </form>
    </div>
    </body>
    </html>
    `);
});



app.get('/nuevo',(req,res) => {
    const nombre = req.query.nombre;
    const precio = req.query.precio;
    console.log(precio);
    const deporte = {
        nombre,
        precio,
    }

    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));

    const deportes = data.deportes;

    deportes.push(deporte);

    fs.writeFileSync("deportes.json", JSON.stringify(data));
    res.send("Deporte agregado con exito");

})

app.get('/deportes', (req, res) => {
    fs.readFile('deportes.json', 'utf8', (err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.send(data);
    });
});


app.get('/modificar',(req,res) => {
    const nombre = req.query.nombre;
    const precio = req.query.precio;

    fs.readFile('deportes.json', 'utf8', (err,data)=>{
        data = JSON.parse(data);
        const deportes = data.deportes;
        const buscar = deportes.find(d => d.nombre === nombre);

        buscar.precio = precio;

        fs.writeFile('deportes.json', JSON.stringify(data), (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send("Precio de deporte modificado con éxito");
        });
    });
})

app.get('/eliminar',(req,res)=>{
    const nombre = req.query.nombre;
    fs.readFile('deportes.json', 'utf8', (err,data)=>{
        data = JSON.parse(data);
        const deportes = data.deportes;
        const buscar = deportes.findIndex(d => d.nombre === nombre);

        deportes.splice(buscar, 1);

        fs.writeFile('deportes.json', JSON.stringify(data), (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send("Precio de deporte modificado con éxito");
        });
    });
})


app.listen(3000,() => {
    console.log('Server arriba en puerto 3000');
});