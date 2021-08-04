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
