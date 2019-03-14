

class Importador {


    constructor() {
        this.archivo = process.argv[2];
        console.log ('Archivo:', this.archivo);

        if (this.archivo) 
          this.procesarArchivo(this.archivo)
        else
          throw new Error ('Archivo invalido:', this.archivo);
    }

    procesarArchivo(archivo) {
        let fs = require('fs');

        fs.readFile (archivo,'utf8', (err,data)=>{
            if (err) throw new Error (err);


            data.split ('\n').forEach((line,idx)=>{
                this.insertaProspecto (line);
            })
        })



    }

    insertaProspecto( csvLine ) {

        // https://api.salesup.com/integraciones/P01AP629876B3-76EF-4066-9729-FB2FF5A89DB9

        const req = require('request');
        let campos = csvLine.split(',');
        let url = 'https://api.salesup.com/integraciones/P01AP629876B3-76EF-4066-9729-FB2FF5A89DB9';


        let data = {
            nombre: campos[0],
            apellidos: campos[1],
            empresa: campos[2],
            correo: campos[3]
        }

        req.post({ url: url, form: data }, (err, res, body) => {
            if (err) 
                throw new Error(err)
            else
                console.log(body);
        })

    }

}

let importador = new Importador()