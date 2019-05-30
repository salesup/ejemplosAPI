/*
    Importación de CFDIs
    Ejemplos SalesUp! API
    =====================
    2019 SalesUp!® Todos los derechos reservados.

*/

const fs = require('fs');

const OPERACIONES = {
    EJECUTA: 0,
    VALIDA: 1,
    LISTADO: 2,
    LISTADO_CARGA: 21,
    OMITIR: 3
}

let config = null;
// cargar el archivo de configuracion...
console.log('Abriendo archivo de configuracion');
config = JSON.parse(fs.readFileSync('config.json'));
if (config.dirRaiz === '') {
    config.dirRaiz = __dirname;
}

const Importador = require('./lib/importacionFacturas');
const Clientes = require('./lib/importacionClientes');

const importador = new Importador(config);
const clientes = new Clientes(config);

let operacion = OPERACIONES.EJECUTA;

const argumentos = process.argv;
const argsStd = [];

argumentos.forEach(argumento => argsStd.push(argumento.toLowerCase()));

if (argsStd.indexOf('-v') > -1) {
    // verificacion
    operacion = OPERACIONES.VALIDA;

} else if (argsStd.indexOf('-l') > -1) {
    // verificacion
    operacion = OPERACIONES.LISTADO;

} else if (argsStd.indexOf('-cl') > -1) {
    // verificacion
    operacion = OPERACIONES.LISTADO_CARGA;

} else if (argsStd.indexOf('-o') > -1) {
    // verificacion
    operacion = OPERACIONES.OMITIR;
}

if (operacion === OPERACIONES.VALIDA) {
    // valida
    let directorio = argumentos[3];
    
    if (!directorio) {
        directorio = 'entrada'
    }
    importador.valida(directorio);
    
} else if (operacion === OPERACIONES.LISTADO) {
  // Lista los clientes
    const nombre = argumentos[3];
    clientes.obtenListado(nombre);

} else if (operacion === OPERACIONES.LISTADO_CARGA) {
    // Carga el listado de clientes
    const nombre = argumentos[3];
    clientes.cargaListado(nombre);

} else if (operacion === OPERACIONES.OMITIR) {
    // omitir ciertas facturas
    const rfc = argumentos[3]
    const directorio = argumentos[4];
    importador.omitir(rfc, directorio)

} else {
    importador.ejecuta();
}
