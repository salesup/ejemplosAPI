//Instalar ejecutando: npm install req
const req = require('request');
const http = require('http');
//Obtenemos el json con los datos del tipo de cambio del dolar con respecto al peso mexicano.
http.get('http://www.banxico.org.mx/pubDGOBC_Sisfix-war/Sisfix_JSON', (resp) => {
   var data = '';
   resp.on('data', (chunk) => {
      data += chunk;
   });
   resp.on('end', () => {
      var json = JSON.parse(data);
      var tipoCambio = json.tcfix   //Se extrae el valor del tipo de cambio.

      req.post({  //Se realiza un login a SalesUp para obtener el token de sesión.
            url: 'https://api.salesup.com/login',
            form: {
               "usuario": "salesup@salesup.com",   //Usuario de tu cuenta de SalesUp!
               "contrasenia": "salesup"   //La contraseña de tu cuenta de SalesUp!
            }},
         function(err, httpResponse, body) {
            var json = JSON.parse(body);
            var tokenSesion = json[0].tkSesion; //Se extrae el token de sesión.

            req.put({   //Se realiza la actualización al tipo de cambio.
                  headers: {
                     token: tokenSesion   //Se utiliza el token de sesión.
                  },
                  url: 'https://api.salesup.com/catalogos/monedas/MON-5A8BD344-7D65-4965-A7DD-65E0CD574450',   //Ruta con el tk de la moneda de dólar (USD) de la cuenta.
                  form: {
                     "tipoCambio": tipoCambio,  //Se utiliza el tipo de cambio.
                     "status": 1
                  }},
               (err, res, body) => {
                  if (err) throw new Error(err)
                  else {
                     console.log("Tipo de Cambio: " + tipoCambio);
                     console.log("Resultado: " + body);
                  }})
         })
   })
}).on("error", (err) => {
   console.log("Error: " + err.message);
});