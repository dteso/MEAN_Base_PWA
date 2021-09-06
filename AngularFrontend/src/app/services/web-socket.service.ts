import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketProviderConnect {
  socket: Socket;

  @Output() outEven: EventEmitter<any> = new EventEmitter();
  constructor() { }

  onConnect(payload: any = {}) {
    try {
      var ws = new WebSocket(environment.server_socket);

      ws.onopen = function (e) {
        console.log("[open] Conexión establecida " + JSON.stringify(e));
        console.info("Enviando al servidor " + JSON.stringify(payload));
        ws.send(payload.query.data);
      };

      ws.onmessage = function (event) {
        // Visualizamos datos recibidos 
        console.log("Server responded: " + event.data);
        //Enviamos una respuesta
        setTimeout(() => ws.send('{"msg":"I received the message"}'),200);
      };

      ws.onclose = () => {
        console.info("Client exited");
      }

    } catch (err) {
      console.log("CONNECTION SOCKET SERVER ERROR " + err);
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

