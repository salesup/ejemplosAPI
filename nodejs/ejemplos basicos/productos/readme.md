## Manipulación de productos con API de SalesUp! CRM

Este directorio contiene ejemplos de como manipular el catálogo de productos de SalesUp! CRM via API.

### Requerimientos previos

Antes de poder ejecutar el programa es necesario teclear el siguientes comando:

```
>> npm install
```

Adicionalmente, es necesario que usted cuente previamente con un token de integración. Dicho token puede obtenerse en el menú Sistema -> Integraciones-> Integración API-> Integración Sistemas Externos. Posteriormente debe substituir el token de integración obtenido en el código fuente, previo a su ejecución.

Para ejecutar el programa deseado, teclee el siguiente comando:

```
>> node [programaDeseado]
```

### 01. Listado básico de los productos de una cuenta


  Este es un ejemplo de como listar de forma asíncrona los productos de una cuenta utilizando un token de sesión. 

  Notas: 
  - Al no especificar columnas, el servicio devolverá todas las existentes.
  - Al no especificar un máximo de registros el servicio devolverá los primeros 50. Si desea obtener todos los productos, consulte los [estándares de paginación](https://desarrollo.salesup.com/induccion/estandares.html)


### 02. Convertir la lista de productos a CSV

Este ejemplo muestra como iniciar sesión, obtener la lista de productos de la cuenta y convertirlos en formato CSV, todo en 50 líneas.

Notas:

- El programa solicita los primeros 1000 registros. Consulte los [estándares de paginación](https://desarrollo.salesup.com/induccion/estandares.html) si desea otras opciones.




  
