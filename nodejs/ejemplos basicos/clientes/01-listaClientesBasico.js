// requiere el módulo request
const req = require('request');

// token de sesión...
let tokenSesion = 'P02NEU1RDA0NEUtQjRCRC00MTJELTgyNTEtNjZDQTMxMjlFQjc1';

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
                console.log(body)
            } else {
                console.log('El resultado no es el esperado:', body);
            }
        }
    })