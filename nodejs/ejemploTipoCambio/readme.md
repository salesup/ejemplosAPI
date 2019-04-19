## Modificación del tipo de cambio usando la información proporcionada por el Banco de México, a través del API de SalesUp! CRM

Este ejemplo permite obtener el tipo de cambio del dolar américano (USD) proporcionado por el Banco de México, posteriormente realiza una actualización al tipo de cambio de la moneda (USD) de SalesUp! CRM via API.

### Requerimientos previos

Antes de poder ejecutar el programa es necesario ejecutar el siguientes comando:

```
>> npm install req 
```

Es necesario editar el archivo index.js para colocar sus credenciales de acceso a SalesUp! CRM, así como definir el token de su moneda (USD).

Para ejecutar el programa deseado, teclee el siguiente comando:

```
>> node index.js
```

### Descripción general

Primero se realiza un GET hacia el API del Banco de México, se obtiene un Json, el cuál tiene la información del tipo de cambio.
Posteriormente se realiza un proceso de POST de login a SalesUp! CRM.
Finalmente se utiliza un método PUT para actualizar el tipo de cambio a la moneda definida.

El ejemplo se encuentra adaptado para obtener el tipo de cambio del dolar américano (USD), pero es posible obtener otros tipos de cambio.

 Consulta _[el webservice]_ de Banxico para obtener los tipos de cambio. _[Información]_ 
[el webservice]: http://www.banxico.org.mx/DgieWSWeb/DgieWS?WSDL
[información]: http://www.anterior.banxico.org.mx/ley-de-transparencia/consultas-frecuentes/%7B960A6514-B048-02B8-4BF2-920034786674%7D.pdf
 