## Manipulación de PROSPECTOS con API de SalesUp! CRM

Este directorio contiene ejemplos de como manipular el catálogo de productos de SalesUp! CRM via API.

### Requerimientos previos

Debe contar con Node 10 o superior así como NPM. Antes de poder ejecutar el programa es necesario teclear el siguientes comando:

```
>> npm install
```

Adicionalmente, es necesario que usted cuente previamente con un token de integración. Dicho token puede obtenerse en el menú Sistema -> Integraciones-> Integración API-> Integración Sistemas Externos. Posteriormente debe substituir el token de integración obtenido en el código fuente, previo a su ejecución.

Para ejecutar el programa deseado, teclee el siguiente comando:

```
>> node [programaDeseado] [argumento1] [argumento2] ...
```

### 01. Listado básico de los Prospectos de una cuenta

 Este es un ejemplo de como listar de forma asíncrona los prospectos de una cuenta utilizando un token de sesión. 

  Notas: 
  - Al no especificar columnas, el servicio devolverá todas las existentes.
  - Al no especificar un usuario, el servicio devolverá los prospectos que pertenezcan al token
    al usuario asociado al token de sesión; revise [documentación de prospectos](https://desarrollo.salesup.com/api-rest/prospectos/#api-Prospectos-GetProspectos).
  - Al no especificar un máximo de registros el servicio devolverá los primeros 50. Si desea obtener todos los productos, consulte los [estándares de paginación](https://desarrollo.salesup.com/induccion/estandares.html).



### 02. Importacion de Prospectos

Este programa inserta prospectos directamente a una cuenta de SalesUp! tomándolos de un archivo
de texto separado por comas. 

Notas:
- Debe proporcionar el nombre del archivo de texto como argumento

