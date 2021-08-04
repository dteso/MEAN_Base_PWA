Carga de módulos de node en el proyecto
Ejecutar "npm install" ó "npm i" en la raíz del proyecto

Paquetes
express - Librería para la gestión de peticiones HTTP

mongoose - ORM (ODM) para conexión entre node y mongoDB

dotenv - Gestión de ficheros .env

cors - Permite hacer configuraciones en el servidor para que acepte peticiones de diferentes dominios. Evita el bloqueo por Cross-Origin-Domain...

express-validator - Librería que permite hacer validaciones semiautomáticas para cada una de las rutas

bcryptjs - Permite encriptar contraseñas

jsonwebtoken Gestión del JSON Web TOken

nodemailer Librería para gestión de correos electrónicos

express-fileupload Librería para subida de ficheros

uuid Generador de identificadores únicos

La cuenta de correo que va a actuar como remitente, en el caso de Google,
debe estar configurada 'Permitiendo el acceso a aplicaciones poco seguras'. Para habilitar 
la funcionalidad, se debe iniciar sesión en google con la cuenta remitente y habilitar el acceso 
desde esta url:
https://myaccount.google.com/u/0/lesssecureapps?pli=1&rapt=AEjHL4PCqXDASqurCfznmBGC9gvtAGOeWv35n64HaDx0C_wf2NPOTOpso-zAasqQkXcTuI0CB5nfPz-6a36sLurhdGaujIlbQA
Pruebas desde POSTMAN:

Si no se he generado un usuario, generarlo. Para ello hay que realizar una petición POST localhost:3000/api/login/

En postman seleccionar [raw] y del desplegable JSON para pasar el cuerpo de la petición de Login como se indica a continuación:

· Body:
{ "password": "123456", "email": "user@email.com" }

Si se trata de un correo válido el servicio mail.js se encargará de enviar un email a esa dirección.

Debe ejecutarse el login para obtener el token que será incluido como 'Header' en todas las peticiones que lo requieran. Se identificará como 'x-token'.

Para la subida de archivos, en postman, como Body seleccionar form-data. En la key se permitirá escoger entre texto y archivo de forma que seleccionaremos archivo.