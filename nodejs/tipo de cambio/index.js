const req = require('request');

// obteniendo el tipo de cambio de banxico
req.get({
   url: 'http://www.banxico.org.mx/pubDGOBC_Sisfix-war/Sisfix_JSON',
   json: true
}, (err, res, body) => {
   if (err) throw new Error(err) 
   else {
      const tipoCambio =  body['tcfix'];
      console.log('Tipo de Cambio: ', tipoCambio);

      // login en SalesUp! por token de integración
      req.post({
         url: 'https://api.salesup.com/integraciones/sesion',
         json: true,
         headers: {
            token: 'P011C1EF370-1E8A-4F1B-A6E9-5FEEC7BA88B7'
         } // Susbsituya su propio token de integracion
      }, (err, res, body) => {

         if (err) throw new Error(err)
         else {
            // este es el token de sesión
            const tokenSesion = body[0].token;
            console.log('Token de sesion: ', tokenSesion);

            //Se realiza la actualización al tipo de cambio.
            req.put({   
                  headers: {
                     token: tokenSesion  
                  },
                  //Ruta con el tk de la moneda de dólar (USD) de la cuenta a modificar.
                  url: 'https://api.salesup.com/catalogos/monedas/MON-5A8BD344-7D65-4965-A7DD-65E0CD574450',   
                  json: true,
                  form: {
                     "tipoCambio": tipoCambio, 
                     "status": 1
                  }},
               (err, res, body) => {
                  if (err) throw new Error(err)
                  else {
                     console.log("Modificación exitosa.");
                     console.log("Resultado: " + body[0].msg);
                  }
            })
         }
      })
   }
});