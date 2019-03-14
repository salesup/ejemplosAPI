## Importación de facturas a través del API de SalesUp! CRM

Este directorio contiene un programa que permite importar archivos de facturas mexicanas (CFDIs) a SalesUp! CRM via API.

### Requerimientos previos

Antes de poder ejecutar el programa es necesario ejecutar el siguientes comando:

```
>> npm install
```

Adicionalmente, es necesario que usted cuente previamente con un token de integración. Dicho token puede obtenerse en el menú Sistema -> Integraciones-> Integración API-> Integración Sistemas Externos. Posteriormente debe substituir el token de integración obtenido en el código fuente, previo a su ejecución.

Para ejecutar el programa deseado, teclee el siguiente comando:

```
>> node index.js
```

### Descripción general

El programa procesará todos los CFDIs que se encuentren en el directorio */entrada*, y una vez procesados los 
moverá al directorio */salida*. En caso de error, el archivo se moverá al directorio */errores*.






  
