import { Injectable, EventEmitter, Output } from '@angular/core';

/**
 * --------------------------------------
 * Importamos los paquetes necesarios "ngx-socket-io" tambien nuestro "environments" y por último
 * "ngx-cookie-service",
 * ----------------------------------------
 */
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
/**
 * Extendemos la clase "Socket" a nuestra clase
 */
export class SocketProviderConnect extends Socket {

  /**
   * Declaramos un metodo de emitir el cual llamaremos "outEven"
   */
  @Output() outEven: EventEmitter<any> = new EventEmitter();

  /**
   * En nuestro constructor injectamos el "CookieService" para luego hacer uso de sus metodos.
   */
  constructor() {
    /**
     * En nuestro "super" declaramos la configuración inicial de conexión la cual hemos declarado en nuestro
     * "environment.serverSocket",
     * tambien vemos como pasamos el "payload" dentro de options y "query"
     */
    super({
      url: environment.server_socket, 
      options: {
        query: {
          payload: `{"id":"${Math.floor(Math.random()*10)}","user":"new_user"}`
        },
      }
    });
    /**
     * ---------------- ESCUCHAMOS----------------
     * En este punto nuestro socket.io-client esta listo para recibir los eventos.
     * 
     * En esta funcion vemos como esta preparado para recibir un evento llamado "message" el cual
     * una vez sea recibido va a emitir por nuestro "outEven"
     */

    this.ioSocket.on('message', res => {
      console.log(res.msg);
      this.outEven.emit(res);
    });
  }

  /**
   * ---------------- EMITIR-------------------
   * Ahora solo nos falta poder emitir mensajes, para ello declaramos la funcion
   * "emitEvent" la cual va ser disparada por un "(click)" la cual emite un envento
   * con el nombre "default", y un payload de información el cual sera parseado 
   * por nuestro backend.
   */

  emitEvent = (event = 'default', payload = {}) => {
    this.ioSocket.emit('default', {payload});
  }

}