/*
  01-ObtenAcceso.js

  Este es un ejemplo de como intercambiar un token de integración por un token de sesión.

  Notas:
  - Un token de integración nunca expirará ni cambiará a menos que sea regenerado o eliminado dentro de SalesUp!
  - Un token de integración permite realizar funciones limitadas como instertar prospectos, 
    consultar ciertos catálogos o ser intercambiado por un token de sesión, 
    pero no tiene acceso a otras funciones del API. Para ello necesitamos un token de sesión.
  - Al generar el token de integración, debe elegirse que usuario heredará sus privilegios al intercambiarse 
    por un token de sesión. De esta manera el token de sesión tendrá los mismos privilegios 
    que el usuario seleccionado.
*/
const req = require('request');

req.post({
    url: 'https://api.salesup.com/integraciones/sesion',
    headers: { token: 'XXXXXXXXXX-XXXX-XXX-XXXX-XXXXXXXX' } // Susbsituya su propio token de integracion
}, (err, res, body) => {

    if (err) throw new Error(err)
    else {
        // este es el token de sesión
        let tokenSesion = JSON.parse(body)[0].token;
        console.log ('token de sesion: ', tokenSesion);
    }
})

