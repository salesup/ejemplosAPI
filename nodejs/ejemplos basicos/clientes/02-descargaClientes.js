// requiere el módulo request
const req = require('request');

// token de sesión...
let tokenSesion = 'P07MDE1MzEwNzEtNTE1MC00RDAzLUE5MUYtRkEwRTRGOTE4MkE3';


req.get({
        url: 'https://api.salesup.com/clientes', // el url del API
        headers: {
            token: tokenSesion
        }, // el token de sesion
        json: true // el API maneja JSON com estándar
    },
    (err, res, body) => {
        // si hay un error
        if (err)
            throw new Error(err)
        else {
            // la respuesta fue correcta
            if (res.statusCode == 200) {
                const csvData = construyeCSV(body);
                guardaCSV(csvData);
            } else {
                console.log('El resultado no es el esperado:', body);
            }
        }
    })

    function construyeCSV(data) {
        let csvData = '';
        let columnas = ['nombre', 'apellidos', 'correo'];

        // encabezado
        csvData = columnas.join(',') + '\n';

        // cuerpo
        for (let r=0; r<data.length; r++) {
            let jsonRenglon= data[r];

            let renglon = []
            for (let c=0; c<columnas.length; c++) {
                nombreCol = columnas[c];
                renglon.push(jsonRenglon[nombreCol]);
            }
            csvData += renglon.join(',') + '\n';
        }
        return csvData;
    }

    function guardaCSV(data) {
        const fs = require('fs');
        fs.writeFile("clientes.csv", data, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Archivo de clientes descargado correctamente");
        });

    }