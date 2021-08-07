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



### GENERACIÓN DE SEEDERS MONGOOSE

1. npm i mongoose-seed

2. Crear modelo correspondiente al seeder que vamos a generar en su correspondienete carpeta ./models/loquesea <--- nombre de la entidad

3. Crearse un archivo, preferentemente en una carpeta /seeders con el nombre: <nombre_entidad.seeder.js>

4. Dentro de ese archivo incluir algo como esto:

        var seeder = require('mongoose-seed');
        require('dotenv').config();   <---- recordar importar del las variables de entorno.

        // Data array containing seed data - documents organized by Model
        var data = [
            {
                'model': '<nombre_del_modelo>',   <-- el singular de como va a llamarse en base de datos la colección
                'documents': [
                    {
                        'name': 'folder1',
                    },
                    {
                        'name': 'folder2',
                    }
                ]
            }
        ];
        
        // Connect to MongoDB via Mongoose
        seeder.connect(process.env.DB_CNN, function() { <--- la misma cnn que para mongoose, la importamos del envirment igualmente, en caso contrario poner aqui la cnn literal (no recomendado)
        
        // Load Mongoose models
        seeder.loadModels([
            './models/entity.model.js',   <------ La referencia al modelo sobre el que vamos a cargar los datos. Imprescindible coherencia con el data declarado para cargar
        ]);
        
        // Clear specified collections
        seeder.clearModels(['Entity'], function() {  <----- el nombre del modelo que indicamos en la propiedad model de data '<nombre_del_modelo>' === 'Entity' por ejemplo
            // Callback to populate DB once collections have been cleared
            seeder.populateModels(data, function() {
            seeder.disconnect();
            });
        
        });
        });

5. Guardamos los cambios en el archivo y lo corremos individualmente con node

        node seeders/folder.seeder.js

NOTA: Como siempre con mongo, si no existe la colección la va a crear en el momento de empezar a grabar datos.

En un mismo seeder se puede inicializar más de un modelo:

  // Load Mongoose models
  seeder.loadModels([
    'app/model1File.js',
    'app/model2File.js'
  ]);
 

 y luego en clear models elegimos los dos Schemas ej:


  // Clear specified collections
  seeder.clearModels(['Model1', 'Model2'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});

como el data es un array de objetos, incluiremos a primer nivel del array tantos objetos como modelos a inicailizar con sus datos correspondientes.



 
