import test from 'ava';
import Importador from '../lib/importacionFacturas';

const path = require('path');

test.beforeEach(t => {
    const config = {
        server: 'https://api.salesup.com',
        token: 'P022EC2546E-CD19-4BDE-B4DE-6D4F8F8CEB6B',
        dirEntrada: '/test',
        dirSalida: '/salida',
        dirErrores: '/errores',
        dirRaiz: path.join(__dirname, '..'),
    };

    t.context = {
        importador: new Importador(config)
    }
});

test('probando listaFacturasParaProcesar()', t => {
    const listaEsperada = ['0a29a5c8-4283-42b2-89c0-d94820ad4b45.xml'];
    const lista = t.context.importador.listaFacturasParaProcesar();
    t.deepEqual(lista, listaEsperada, 'Los archivos listados no son iguales.');   
})


test('probando purgaNombres()', t => {
    const testCases = [
        { lista: ['archivo1.pdf', 'archivo1.xml', 'archivo2.zip'], nombres: ['archivo1', 'archivo2.zip'] }
    ]

    testCases.forEach(currentTest => {
        t.deepEqual(t.context.importador.purgaNombres(currentTest.lista), currentTest.nombres, 'El resultado no coincide');
    })
})
