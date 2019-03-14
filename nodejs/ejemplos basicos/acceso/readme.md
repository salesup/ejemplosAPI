## Ejemplos de acceso con API de SalesUp! CRM

Este directorio contiene ejemplos de como acceder al API utilizando una llave de integración (token).

### Requerimientos previos

Antes de poder ejecutar el programa es necesario ejecutar el siguientes comando:

```
>> npm install
```

Adicionalmente, es necesario que usted cuente previamente con un token de integración. Dicho token puede obtenerse en el menú Sistema -> Integraciones-> Integración API-> Integración Sistemas Externos. Posteriormente debe substituir el token de integración obtenido en el código fuente, previo a su ejecución.

Para ejecutar el programa deseado, teclee el siguiente comando:

```
>> node [programaDeseado]
```

### 01. Intercambio de token de integración por token de sesión


  Este es un ejemplo de como intercambiar un token de integración por un token de sesión.

  *Notas*:

  - Un token de integración nunca expirará ni cambiará a menos que sea regenerado o eliminado dentro de SalesUp!
  - Un token de integración permite realizar funciones limitadas como instertar prospectos, 
    consultar ciertos catálogos o ser intercambiado por un token de sesión, 
    pero no tiene acceso a otras funciones del API. Para ello necesitamos un token de sesión.
  - Al generar el token de integración, debe elegirse que usuario heredará sus privilegios al intercambiarse 
    por un token de sesión. De esta manera el token de sesión tendrá los mismos privilegios 
    que el usuario seleccionado.

