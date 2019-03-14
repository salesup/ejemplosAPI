const req = require('request-promise');
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');

 class Clientes {


    constructor(config) {
        this.config = config;
    }

    obtenTokenSesion() {
        return new Promise((resolve, reject) => {
            console.log('Obteniendo sesión...');
            req.post({
                url: `${this.config.server}/integraciones/sesion`,
                json: true,
                headers: {
                    token: this.config.token
                },
            }).then(res => {
                // este es el token de acceso
                resolve(res[0].token);
            }).catch(error => {
                reject(error);
            })
        });
    }

    mapea(registro) {
        return {
            tkEmpresa: registro.tkEmpresa,
            tkProspecto: registro.tkProspecto,
            empresa: registro.empresa,
            nombre: registro.nombre,
            apellidos: registro.apellidos,
            correo: registro.correo,
            telefono: registro.telefono,
            movil: registro.movil,
            ejecutivo: registro.ejecutivoIniciales
        }
    }

    generaCSV(json) {
        JSON.stringify()
        // gene ra un listado en formato CSV...
        const replacer = (key, value) => (value === null ? '' : value);  
        const header = Object.keys(json[0]);
        let csv = json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        csv = csv.join('\r\n');
        return csv
    }

    obtenListado(nombreCSV) {        
        
        this.obtenTokenSesion().then((token) => {
            console.log('Obteniendo listado...');
            const listado = [];
            req.get({
                url: `${this.config.server}/clientes?tkusuario=*&pagina=0`,
                headers: {
                    token
                },
                json: true
            }).then(listadoClientes => {
                listadoClientes.forEach(registro => {
                    listado.push(this.mapea(registro));
                })
                const archivoCSV = path.join(this.config.dirRaiz, nombreCSV);
                console.log('Generando archivo CSV: ', nombreCSV);
                fs.writeFileSync(archivoCSV, this.generaCSV(listado));
                console.log('Archivo generado con éxito.');
            })

        });
    }

    // cargar el listado 

    actualizaRegistro(datos, token) {

        const url = `https://api.salesup.com/clientes/${datos.tkProspecto}`;
        const data = {
            nombre: datos.nombre,
            apellidos: datos.apellidos,
            correo: datos.correo,
            telefono: datos.telefono,
            movil: datos.movil
        }
        return req.put({
                    url,
                    body: data,
                    json: true,
                    headers: { token }
                }, (err, res) => {
                    if (err) {
                        console.log('ERRROR****', err);
                        Promise.reject(err)
                    } else {
                        console.log('Se actualizó el registro: ', datos.tkProspecto, datos.empresa);
                        Promise.resolve(res)
                    }
                });
    }

    cargaListado(archivoCSV) {

        const archivo = path.join(this.config.dirRaiz, archivoCSV);
        console.log('Cargando el archivo...', archivo);

        this.obtenTokenSesion().then((token) => {
            const csvData = fs.readFileSync(archivo);
            parse(csvData, {
                columns: true
            }, (err, output) => {
                if (err) {
                    console.log(err)
                } else {
                    output.forEach(async datos => {
                        await this.actualizaRegistro(datos, token);
                    })
                }
            })

        });

        
    }


}

module.exports = Clientes;
