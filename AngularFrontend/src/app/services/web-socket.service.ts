import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketProviderConnect {
  socket: Socket;

  @Output() outEven: EventEmitter<any> = new EventEmitter();
  constructor() {}

  async onConnect(payload = {}){
    try{
      this.socket = io(environment.server_socket, payload);
    }catch(err){
      console.log("ERROR "+ err);
    }
    this.listenEvent('message');
  }

  listenEvent(event){
    this.socket.on(event, res => {
      console.log(res.msg);
      this.outEven.emit(res);
    });
  }

  emitEvent = (event = 'default', payload = {}) => {
    this.socket.emit('default', {payload});
  }

}