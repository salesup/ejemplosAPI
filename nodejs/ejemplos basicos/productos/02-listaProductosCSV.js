const req = require('request-promise');
const Json2csv = require('json2csv').Parser;


let tokenIntegracion = 'P038141DF23D-DA43-4263-9FE8-903B79C7DDE0';
let tokenSesion = '';

let optionsToken = {
    method: 'POST',
    url: 'https://api.salesup.com/integraciones/sesion',
    headers: {
        token: tokenIntegracion
    },
    json: true
}

req(optionsToken).then(body=>{
    // la sesión fue exitosa
    tokenSesion = body[0].token;
    console.log ('Token de Sesión', tokenSesion);

    // trae la lista de productos con el token de sesión previamente obtenido
    let optionsProductos = {
        method: 'GET',
        url: 'https://api.salesup.com/catalogos/productos?cantidadRegistros=1000',
        headers: {
            token: tokenSesion
        },
        json: true
    }

    req(optionsProductos).then(body=>{

        // construye el parser de JSON a CSV
        const fields = ['codigo','nombre','lineaProducto','marca','existencia','tkProducto'];
        const csvParser = new Json2csv({fields});
        const csv = csvParser.parse(body);
        
        // imprime el archivo en la pantalla
        console.log('******************************************')
        console.log (csv);
        console.log('******************************************')

    }).catch(err=>{
        console.log('Fallo al obtener productos', err);
    })
})
.catch(err=>{
    console.log ('Fallo al obtener la sesión', err);
})