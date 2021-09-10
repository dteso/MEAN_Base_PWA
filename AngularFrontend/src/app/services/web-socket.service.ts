import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SocketClient } from '../models/socket-client.model';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Subject } from 'rxjs';
@Injectable()
export class SocketProviderConnect {

  constructor() { }

  uuid; //Uuid que va a tener el cliente en cada una de sus conexiones a servidor. Es generado por servidor cuando recibe comunicación con el websocket

  subject: WebSocketSubject<any>; //La conexión en sí, es la que nos va a permitir leer (.subscribe) o escribir (.next())
  socketClient = new Subject<any>(); //La información del cliente al que se le va a asignar una uuid generada por el servidor en el momento de la conexión

  public onConnect(payload: SocketClient = {}): any { // ---> El payload recibido viene desde el appComponent en el ngOnInit()
    try {
      //Establecemos conexión
      this.subject = webSocket(environment.server_socket);

      // Leemos del servidor. Nos suscribimos. A partir de ahora vamos a recibir todos los mensajes del servidor aquí
      this.subject.subscribe(ws => {
        console.log('Socket Data', ws);

        //Emitiemos el payload al servidor. Incialmente sólo vamos a mandar un evento con la propiedad type = 'CONNECT' (ver app.component)
        //Cuando el servidor reciba esta info sin id, el se encarga de asignarlo y nos devuelve un uuid
        setInterval(()=>{this.send(payload)}, 5000); // Debemos retransmitirla para que no se corte la comunicación. 
                                                     // Esto en localhost no tiene por qué pasar pero hay servidores como Heroku en los que existe un Timeout si no se recibe evento del servidor.
                                                     // Lo óptimo es configurar esos Timeouts en servidor y sólo enviar una vez.
        this.checkSocket(ws); //Vamos a leer la información que viene como datos del cliente. Se manda el ws recibido como respuesta para analizarlo
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
      console.log("USER LOGGED OUT " + socket.id + " / " + socket.users + " users left.")
    }

    // Si el socket trae un objeto con uuid debemos asignarla a nuestro cliente
    else if (socket.uuid) {
      console.info("UUID Assigned by server: ", socket.uuid);
      this.socketClient.next(socket);
      this.uuid = socket.uuid;

    } 

    // Si se trata de un mensaje 
    else if (socket.message) {
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

