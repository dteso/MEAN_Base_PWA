import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SocketClient } from '../models/socket-client.model';
import { webSocket } from "rxjs/webSocket";
import { Subject } from 'rxjs';
@Injectable()
export class SocketProviderConnect {

  constructor() { }

  subject;
  clientId = new Subject<any>();
  uuid;

  public onConnect(payload: SocketClient = {}): any {
    try {
      //Establecemos conexión
      this.subject = webSocket(environment.server_socket);

      // Leemos del servidor. Nos suscribimos. A partir de ahora vamos a recibir todos los mensajes del servidor aquí
      this.subject.subscribe(ws => {
        console.log('Socket Data', ws);
        const socket: any = ws;

        //Emitiemos el payload al servidor
        this.send(payload);
        this.checkSocket(socket);
      })
    } catch (err) {
      console.log("CONNECTION SOCKET SERVER ERROR " + err);
    }
  }

  /* Establece un nuevo mensaje en la conexión con el servidor. El formato del mensaje viene defuinido por la interfaz SocketClient */
  send(payload: SocketClient) {
    this.subject.next(payload);
  }

  checkSocket(socket: any) {
    // Si recibimos solicitud de supervision del servidor contestamos con nuestros datos tipo CONNECTION
    if (socket.action && socket.action === "check-alive") {
      let client: SocketClient = {};
      client.type = 'CONNECTION';
      client.clientId = this.uuid;
      this.send(client);
    }
    // Si otro cliente se desconecta se nos notifica por aquí
    else if (socket.action && socket.action === "user-logged-out") {
      console.log("USER LOGGED OUT " + socket.id)
    }
    // Si el socket rae un objeto con uuid debemos asignarla a nuestro cliente
    else if (socket.uuid) {
      console.info("UUID Assigned by server: ", socket.uuid);
      this.clientId.next(socket.uuid);
      this.uuid = socket.uuid;
    // Si se trata de un mensaje 
    } else if (socket.message) {
      console.info(socket.message);
    }
  }
}
























/* Esto con socket io client */



  // public get IoStatus(){
  //   return this.socket? true: false;
  // }


  // onConnect(payload = {}){
  //   try{
  //     // conection ---> io(http://my_socket_server:port)
  //     // this.socket = io(environment.server_socket, payload);
  //     this.socket = io(environment.server_socket, payload);
  //   }catch(err){
  //     console.log("CONNECTION SOCKET SERVER ERROR "+ err);
  //   }
  //   this.listenEvent('message');
  // }

  // listenEvent(event){
  //   try{
  //     this.socket.on(event, res => {
  //       console.log(res.msg);
  //       this.outEven.emit(res);
  //     });
  //   }catch(err){
  //     console.log("ERROR ON SUBSCRIPTION TO SOCKET SERVER "+ err);
  //   }
  // }

  // emitEvent = (event = 'default', payload = {}) => {
  //   try{
  //     this.socket.emit( event, {payload} );
  //   }catch(err){
  //     console.log("ERROR EMMITING TO SOCKET SERVER "+ err);
  //   }
  // }

