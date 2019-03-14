/*
    02-importaProspectoCSV.js
    Este programa inserta prosepctos de un archivo separado por comas.
*/

class Prospectos {

  constructor() {
    this.archivo = process.argv[2];
    console.log('archivo:', this.archivo);

    if (this.archivo) 
        this.procesaArchivo()
    else
        throw new Error ('Nombre de archivo inválido');

  }

  insertaProspecto( csvLine ) {
      let campos = csvLine.split(',');
      const req = require('request');

      // substituya aqui su token de integración
      let url = 'https://api.salesup.com/integraciones/P0XAP6B271CD2-CFC7-418C-84C0-6A8CC79DD552';

      let data = {
          nombre: campos[0],
          apellidos: campos[1],
          empresa: campos[2],
          correo: campos[3],
          telefono: campos[4]
      }
      console.log('Data', data);

      req.post ({url:url, form:data},(err,res,body)=>{
        if (err) throw new Error (err) 
        else
          // se agrega el contacto exitosamente
          console.log (body);
      })

  }

  procesaArchivo() {
      let fs = require('fs');
      fs.readFile(this.archivo,'utf8',(err,data)=>{
          if (err) throw new Error (err);

          data.split('\r\n').forEach((line)=>{
              this.insertaProspecto (line);
          })
      });

  }
}
let prospectos = new Prospectos()





