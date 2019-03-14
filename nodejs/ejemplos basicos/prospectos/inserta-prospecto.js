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
      //let url = 'https://api.salesup.com/integraciones/P01D7CCDC59-6310-4004-A888-8F2B32297DD8';
      let url = 'https://api.salesup.com/integraciones/P01AP5A271C42-CFC8-418C-84C0-6A8CC79DD552';

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
          console.log (body);
      })

  }

  procesaArchivo() {
      let fs = require('fs');
      fs.readFile(this.archivo,'utf8',(err,data)=>{
          if (err) throw new Error (err);

          data.split('\r\n').forEach((line,idx)=>{
              this.insertaProspecto (line);
          })
      });

  }
}
let prospectos = new Prospectos()





