const req = require('request-promise');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');


class ImportaFacturas {


    constructor(config) {
        this.MAX_ARCHIVOS = 8;
        this.config = config;
        this.urlXML = `${config.server}/facturacion/mx/xml`;
    }


    procesaBatch(maximo) {
        this.procesando = true;
        const total = this.nombres.lenght < maximo ? this.nombres.length : maximo;

        const promesas = [];

        for (let i = 0; i < total; i++) {
            const archivo = this.nombres[i];
            if (archivo) {
                const p = new Promise((resolve, reject) => {
                    console.log('Procesando archivo:', archivo);

                    try {
                        this.procesaArchivoXML(archivo).then(() => {
                            resolve();
                        })
                        
                    } catch (error) {
                        console.log('**ERROR**', error);
                        reject();            
                    }
                });
                promesas.push(p);
            }
        }

        Promise.all(promesas).then(() => {
            console.log('Batch procesado');
            this.nombres.splice(0, this.MAX_ARCHIVOS);
            this.procesando = false;
            this.siguienteLote();
        })

    }

    siguienteLote() {
        if (this.nombres.length > 0) {
            this.procesaBatch(this.MAX_ARCHIVOS);
        }

    }

    ejecuta() {
        const archivos = this.listaFacturasParaProcesar();
        if (!archivos || archivos.length === 0) {
            console.log('Ningun archivo que importar!');
            process.exit(0);
        }

        this.normalizaArchivos(archivos).then((archivosNormalizados) => {
            console.log('Enviando facturas...');
            this.nombres = archivosNormalizados;
            this.procesando = false;
            this.procesaBatch(this.MAX_ARCHIVOS);
        }).catch(err => {
            console.log(err);
            process.exit(1);
        });

    }

    normalizaPDF(archivoOriginal, archivoNormalizado) {
        return (
            (this.renombraArchivo(`${archivoOriginal}.pdf`, `${archivoNormalizado}.pdf`, this.config.dirEntrada))  
            || (this.renombraArchivo(`${archivoOriginal}.PDF`, `${archivoNormalizado}.pdf`, this.config.dirEntrada))
            || (this.renombraArchivo(`${archivoOriginal}.Pdf`, `${archivoNormalizado}.pdf`, this.config.dirEntrada)) 
        )
    }

    normalizaArchivos(archivos) {
        return new Promise((resolve, reject) => {            
            const total = archivos.length;
            const normalizados = [];
            console.log(`Normalizando ${total} archivos...`);
            try {
                archivos.forEach((archivoOriginal, i) => {
                
                    this.convierteXMLaJSON(this.config.dirEntrada, archivoOriginal).then(cfdi => {
                        const tipo = cfdi.tipoComprobante.toLowerCase();
                        let archivoNormalizado = cfdi.UUID ? cfdi.UUID.toLowerCase() : path.basename(archivoOriginal.toLowerCase(), '.xml');
                        if (tipo === 'p') archivoNormalizado = `p-${archivoNormalizado}`;

                        normalizados.push(archivoNormalizado)

                        if (['p', 'i'].indexOf(tipo) > -1) {
                            // comprobante de pago...
                            if (this.renombraArchivo(archivoOriginal, `${archivoNormalizado}.xml`, this.config.dirEntrada)) {
                                // renombra el PDF correspondiente
                                // const nombreOriginal = archivoOriginal.split('.')[0];
                                const nombreOriginal = path.basename(archivoOriginal, '.xml');
                                this.normalizaPDF(nombreOriginal, archivoNormalizado);
                            }
                        } else {
                            // lo debe mandar directo a omitir...
                            console.log('Se ignora este archivo porque no es de ingreso ni de pago:', archivoOriginal);
                            // TODO: ademas de moverlo, debe crear un archivo de error con 
                        }
                        
                    });

                    // verfica si ya termino...
                    if (i >= total - 1) { 
                        normalizados.sort();
                        resolve(normalizados) 
                    }
                })
            } catch (error) {
                reject(error);
            } 
        });
    }


    escribeArchivoLog(archivo, texto) {
        const archivoErr = path.join(this.config.dirRaiz, this.config.dirErrores, `${archivo}.error.txt`);
        const stream = fs.createWriteStream(archivoErr);
        // eslint-disable-next-line no-unused-vars
        stream.once('open', (_fd) => {
            stream.write(texto);
            stream.end();
        });
    }

    mueveArchivo(nombre, ext, directorioActual, directorioNuevo) {
        const archivoActual = path.join(this.config.dirRaiz, directorioActual, `${nombre}.${ext}`);
        const archivoNuevo = path.join(this.config.dirRaiz, directorioNuevo, `${nombre}.${ext}`);
        fs.renameSync(archivoActual, archivoNuevo);
    }

    renombraArchivo(nombre, nuevoNombre, directorio) {
        const archivoActual = path.join(this.config.dirRaiz, directorio, nombre);
        const archivoNuevo = path.join(this.config.dirRaiz, directorio, nuevoNombre);
        try {
            if (archivoActual !== archivoNuevo) {
                fs.renameSync(archivoActual, archivoNuevo);
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    
    procesaArchivoXML(archivo) {

        // agrega el token de integración
        const headers = {
            token: this.config.token
        }

        if (!archivo) {
            console.log('El nombre del archivo no puede ser nulo.');
            return Promise.resolve({ error: 'El archivo no puede ser nulo' });
        }


        // agrega los archivos a importar
        const xmlFile = path.join(this.config.dirRaiz, this.config.dirEntrada, `${archivo}.xml`);
        const pdfFile = path.join(this.config.dirRaiz, this.config.dirEntrada, `${archivo}.pdf`);

        const xmlExists = fs.existsSync(xmlFile);
        const pdfExists = fs.existsSync(pdfFile);

        if (!(xmlExists && pdfExists)) {
            const falta = pdfExists ? `${archivo}.xml no existe.` : `${archivo}.pdf no existe.`;
            console.log(falta);
            return Promise.resolve({ error: falta })
        }
        
        const data = {
            archivoXml: fs.createReadStream(xmlFile),
            archivoPdf: fs.createReadStream(pdfFile)
        }

        return req.post({
            url: this.urlXML,
            formData: data,
            headers
        }, (err, res) => {
            if (err) {
                console.log(err);
                Promise.resolve({ error: err });
            } else if (res.statusCode !== 200) {
                console.log(res.body)
                Promise.resolve({ error: res.statusCode });
            } else {
                // la operacion tuvo exito y hay que mover el archivo

                const objJSON = JSON.parse(res.body);
                if (objJSON && objJSON.code === 0) {
                    // todo funcionó bien...
                    const newXMLfile = path.join(this.config.dirRaiz, this.config.dirSalida, `${archivo}.xml`);
                    const newPDFfile = path.join(this.config.dirRaiz, this.config.dirSalida, `${archivo}.pdf`);
                    fs.renameSync(xmlFile, newXMLfile);
                    fs.renameSync(pdfFile, newPDFfile);
                    console.log(`La factura ${archivo} fue ingresada con exito y se ha movido al directorio de salida.`);

                } else if (objJSON && objJSON.code === 31 && objJSON.errores[0].details.code === 9011) {
                    // la factura ya está activa...
                    const newXMLfile = path.join(this.config.dirRaiz, this.config.dirSalida, `${archivo}.xml`);
                    const newPDFfile = path.join(this.config.dirRaiz, this.config.dirSalida, `${archivo}.pdf`);
                    fs.renameSync(xmlFile, newXMLfile);
                    fs.renameSync(pdfFile, newPDFfile);
                    console.log(`La factura ${archivo} ya existe en el sistema.`);

                } else {
                    this.escribeArchivoLog(archivo, JSON.stringify(res.body));
                    // mueve los archivos al directorio de errores
                    const newXMLfile = path.join(this.config.dirRaiz, this.config.dirErrores, `${archivo}.xml`);
                    const newPDFfile = path.join(this.config.dirRaiz, this.config.dirErrores, `${archivo}.pdf`);
                    fs.renameSync(xmlFile, newXMLfile);
                    fs.renameSync(pdfFile, newPDFfile);
                    console.log(`La factura ${archivo} tuvo errores.`);

                }
            }
        })

    }

    listaFacturasParaProcesar(directorio) {
        // lista los archivos en el directorio que sean xml.
        let archivos;
        const archivosFiltrados = [];
        const dirEntrada = path.join(this.config.dirRaiz, directorio || this.config.dirEntrada);
        try {
            archivos = fs.readdirSync(dirEntrada);
            if (archivos && archivos.length > 0) {
                archivos.forEach((archivo) => {
                    const ext = path.extname(archivo);
                    if (ext && ext.toLowerCase() === '.xml') {
                        archivosFiltrados.push(archivo);
                    }
                })
            }
        } catch (error) {
            console.log('Error', error.error ? error.error : error);
            process.exit(1);
        }
        return archivosFiltrados;
    }


    // validaciones

    convierteXMLaJSON(directorio, nombre) {
        const archivo = path.join(this.config.dirRaiz, directorio, nombre);
        const parser = new xml2js.Parser();

        return new Promise((resolve, reject) => {
            const XML = fs.readFileSync(archivo);
            parser.parseString(XML, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                const impuestosTrasladados = (data['cfdi:Comprobante']['cfdi:Impuestos'] && data['cfdi:Comprobante']['cfdi:Impuestos'][0]) 
                   ? parseFloat(data['cfdi:Comprobante']['cfdi:Impuestos'][0].$.TotalImpuestosTrasladados) : 0;
                const res = {
                    UUID: data['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$.UUID,
                    rfcEmisor: data['cfdi:Comprobante']['cfdi:Emisor'][0].$.Rfc,
                    rfcReceptor: data['cfdi:Comprobante']['cfdi:Receptor'][0].$.Rfc,
                    subTotal: parseFloat(data['cfdi:Comprobante'].$.SubTotal),
                    moneda: data['cfdi:Comprobante'].$.Moneda,
                    total: parseFloat(data['cfdi:Comprobante'].$.Total),
                    fomaPago: data['cfdi:Comprobante'].$.FormaPago,
                    metodoPago: data['cfdi:Comprobante'].$.MetodoPago,
                    tipoComprobante: data['cfdi:Comprobante'].$.TipoDeComprobante,
                    tipoCambio: parseFloat(data['cfdi:Comprobante'].$.TipoDeCambio),
                    impuestosTrasladados
                }
                resolve(res)
                }
            })
        })
    }

    creaNuevoResumen() {
        return {
            conteoFacturas: 0,
            conteoReps: 0,
            conteoOtros: 0,
            subTotal: 0,
            pagado: 0,
            pendiente: 0, 
            impuestos: 0,
            total: 0
        }
    }

    valida(directorio) {
        console.log('Validando', directorio);
        const resumen = {};
        const archivos = this.listaFacturasParaProcesar(directorio);
        this.nombres = this.purgaNombres(archivos);
        const totalArchivos = this.nombres.length;

        this.nombres.forEach((nombre, i) => {
            this.convierteXMLaJSON(directorio, nombre).then(cfdi => {
                if (!resumen.hasOwnProperty(cfdi.moneda)) {
                    // ya tiene la propiedad
                    resumen[cfdi.moneda] = this.creaNuevoResumen()
                }
                // si es una factura o un REP
                if (cfdi.tipoComprobante === 'I') { 
                    resumen[cfdi.moneda].conteoFacturas++;
                } else if (cfdi.tipoComprobante === 'P') {
                    resumen[cfdi.moneda].conteoReps++;
                } else {
                    resumen[cfdi.moneda].conteoOtros++;
                }
                resumen[cfdi.moneda].subTotal += cfdi.subTotal;
                resumen[cfdi.moneda].total += cfdi.total;
                resumen[cfdi.moneda].impuestos += parseFloat(cfdi.impuestosTrasladados);

                if (cfdi.formaPago === '99' || cfdi.metodoPago === 'PPD') {
                    resumen[cfdi.moneda].pendiente += cfdi.subTotal
                } else {
                    resumen[cfdi.moneda].pagado += cfdi.subTotal
                }

                if (i === totalArchivos - 1) {
                    // es el ultimo
                    console.log('*************');
                    console.dir(resumen);
                    console.log('*************');
                }
            })
        })


    }

    // omitir

    purgaNombres(archivos) {
        const nombres = [];
        if (archivos && archivos.length > 0) {
            archivos.forEach(elemento => {
                const nom = elemento.split('.')[0];
                const ext = elemento.toLowerCase().split('.')[1];
                if (ext === 'zip') {
                    nombres.push(elemento)
                } else if (nom > '' && nombres.indexOf(nom) === -1) {
                    nombres.push(nom);
                }
            })
        }
        return nombres;
    }

    omitir(rfc, directorio) {

        const dirOmitir = path.join(this.config.dirRaiz, directorio);
        if (!fs.existsSync(dirOmitir)) {
            fs.mkdirSync(dirOmitir);
        }
        console.log('Moviendo comprobantes emitidos a: ', rfc, 'al directorio:', dirOmitir);

        const archivos = this.listaFacturasParaProcesar(this.config.dirEntrada);
        this.nombres = this.purgaNombres(archivos);

        let omitidos = 0;
        const total = this.nombres.length;
        // mueve los archivos...
        this.nombres.forEach((nombre, i) => { 
            this.convierteXMLaJSON(this.config.dirEntrada, nombre).then(cfdi => {

                const omitePorRfc = cfdi.rfcReceptor.toLowerCase() === rfc.toLowerCase();
                const omitePorTipo = (cfdi.tipoComprobante.toLowerCase() !== 'i' && cfdi.tipoComprobante.toLowerCase() !== 'p');
                
                if (omitePorRfc || omitePorTipo) {
                    this.mueveArchivo(nombre, 'xml', this.config.dirEntrada, directorio);
                    this.mueveArchivo(nombre, 'pdf', this.config.dirEntrada, directorio);
                    omitidos += 2;
                }
            })
            if (i === total - 1) {
                console.log('Archivos omitidos: ', omitidos);
                console.log('Proceso finalizado.');
            }
        }) 
    }

}

module.exports = ImportaFacturas;
