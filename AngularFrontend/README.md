PWA

1. Enviroments

enviroments/enviroment.prod.ts

api_url: "http://localhost:3000/api"

2. ng buid

3. npm i -g http-server //instalándolo como dependencia de desarrollo no se ha conseguido hacer funcionar

4. ng add @angular/pwa

* angular.json:
    - Añade manifest.json en el apartado de assets
    - Añade flag serviceWorker: true
    - Añade configuración 'ngswConfigPath' con la ruta del archivo de configuración para el service worker ngsw-worker.js
* package.json: Añade dependencia a @angular/service-worker
* index.html:
    - link a manifest.json
    - meta theme-color para cuando se "instale" en algún dispositivo
    - noscript html tag
* manifest.json: configuración de la aplicación para cuando se "instale" en el dispositivo
* ngsw-config.json: archivo de configuración y estrategias de cacheo para el service worker que crea angular.
* app.module.ts: registra e instala el service worker ngsw-worker.js (auto generado por angular basado en ngsw-config.json)
* icons: iconos en diferentes tamaños para usarse como icono de aplicación cuando se instale en algún dispositivo


  http-server -p 8080 -c-1 dist/login-app



  ## PUSH NOTIFICATIONS

  La aplicación debe ya haber sido configurada como pwa

  1. Instalar 
        npm install web-push -g
  2. Generar VAPIDS
         web-push generate-vapid-keys --json

         Se muestran en consola las claves pública y privada, en nuestro proyecto se almacenan como
         variables de entorno en enviroment y enviroment.prod

  3. En el app.component suscribirnos mediante la clave publica. Nos ayudaremos de SwPush

    import { SwPush, SwUpdate } from '@angular/service-worker';

    export class AppComponent implements OnInit {

        constructor(private swPush: SwPush){}

        /* En el constructor o en el OnInit */
        this.swPush.requestSubscription({
            serverPublicKey: environment.publicKey
        })

    Necesitamos un backend que emita una notificacion



### SOCKETS

Notas: Se ha implementado el uso de 2 librerías, haciendo uso finalmente socket.io-client. El motivo principal es la flexibilidad, ya que con ngx-socket debemos definir la conexión y el payload invocando al super de la
clase Socket desde nuestro constructor. Esto nos limitaba y densificaba el código comparándolo con otra prueba de implementación con io-client en la que como se puede apreciar en el código del repositorio, la implementación con esta librería
es 100% flexible y dinámica, además de ser insultantemente sencilla.


Se deja como referencia unas notas de cara a aquellos que deseen realizar el cambio de librería a ngx teniendo en cuenta las limitaciones comentadas:


-- Con ngx

        npm i ngx-socket-io --save
        npm i ngx-cookie-service --save

Se va a utilizar un servicio propio WebSocket que va a:

- Extender de Sockets, permitiendonos utilizar la instancia ioSocket de la clase WrappedSocket
- En su constructor a traves de super definimos la url a la que va a atacar el cliente y con que payload
    super({
      url: environment.server_socket, 
      options: {
        query: {
          payload: `{"id":"${Math.floor(Math.random()*10)}","user":"new_user"}` // ---> Podría ser el usuario del storage o una cookie por ejemplo. Esto es lo que va a llegar en el callbak del backend :  let {payload} = socket.handshake.query;                                                                //     Siempre debe ser un string
          },                                                                         
      }
    });

- SUBSCRIPCIÓN on('nombre_del_canal', res => contenido recibido): ----> Desde el backend se habrá ejecutado un socket.emit('nombre_del_canal', contenido a enviar )
    this.ioSocket.on('message', res => {
      console.log(res.msg);
      this.outEven.emit(res);  ---> OPCIONAL: En nuestro caso tenemos un @Output por si quisieramos escuchar este evento en el padre
    });

- PUBLICACIÓN emit() ---> Desde el backend se escuchará desde un socket.on('nombre_del_canal', contenido a enviar )
    this.ioSocket.emit('default', {payload}); ---> A qué canal que esté escuchando en el server se le publica el payload
    

-- Con io client

        import { Injectable, EventEmitter, Output } from '@angular/core';
        import { environment } from 'src/environments/environment';
        import { io, Socket } from 'socket.io-client';

        @Injectable()
        export class SocketProviderConnect {
        socket: Socket;

        @Output() outEven: EventEmitter<any> = new EventEmitter();
        constructor() {}

        public get IoStatus(){
            return this.socket? true: false;
        }
        
        
        onConnect(payload = {}){
            try{
            // conection ---> io(http://my_socket_server:port)
            this.socket = io(environment.server_socket, payload);
            }catch(err){
            console.log("CONNECTION SOCKET SERVER ERROR "+ err);
            }
            this.listenEvent('message');
        }

        listenEvent(event){
            try{
            this.socket.on(event, res => {
                console.log(res.msg);
                this.outEven.emit(res);
            });
            }catch(err){
            console.log("ERROR ON SUBSCRIPTION TO SOCKET SERVER "+ err);
            }
        }

        emitEvent = (event = 'default', payload = {}) => {
            try{
            this.socket.emit( event, {payload} );
            }catch(err){
            console.log("ERROR EMMITING TO SOCKET SERVER "+ err);
            }
        }

        }