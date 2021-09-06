
/*
 * -------- socket io connection---------*/

let current_users_count = 0;

clients = [];

startSockets = (server) => {
  const { Server } = require('ws');
  const wss = new Server({ server });

  // wss.listen(5000, function () {
  //     console.log('\n')
  //     console.log(`>> Socket listo y escuchando por el puerto: 5000`)
  // })

  wss.on('connection', (ws, req) => {

    console.log('Client connected ' + req.socket.remoteAddress);
    wss.clients.forEach( ws => {
      ws.send('New client connected. Total users connected: ' + wss.clients.size);
    });

    clients.push(ws);

    console.log(" Usuarios logados: "+ wss.clients.size);

    ws.send(new Date().toTimeString());

    ws.on('close', (ws) => {
      console.log('Client disconnected');
      console.log(" Usuarios logados: "+ wss.clients.size);
    });

    ws.on('message', (event) => {
      console.log("Message from client >>> " + event);
      eventObject = JSON.parse(event);

      console.warn('Event Type: ', eventObject.type);
      console.warn('Room: ', eventObject.room);
      console.warn('User: ', eventObject.user);
      console.warn('Message: ', eventObject.msg);
    });

  });
}

module.exports = {
  startSockets
}




























  // const io = socketIO(server, {
  //         cors: {
  //           origins: [
  //             'https://digitalophy-beta.herokuapp.com' ,
  //             'http://92.56.96.192:4200',
  //             'http://192.168.1.41:3000',
  //             'http://192.168.1.41:4200',
  //             'http://localhost:4200'],
  //           credentials: true //https://socket.io/docs/v3/using-multiple-nodes/index.html --> Important note: if you are in a CORS situation (the front domain is different from the server domain) and session affinity is achieved with a cookie, you need to allow credentials:
  //         },
  //         transports: ['websocket'],
  //         autoconnect: true
  //       });

  //   }
// startSockets = (app) => {
//   const socketIO = require('socket.io');
//   const server = require('http').createServer(app);
//   //const server = express();
//   server.listen(5000, function () {
//       console.log('\n')
//       console.log(`>> Socket listo y escuchando por el puerto: 5000`)
//   })

//   const io = socketIO(server, {
//           cors: {
//             origins: [
//               'https://digitalophy-beta.herokuapp.com' ,
//               'http://92.56.96.192:4200',
//               'http://192.168.1.41:3000',
//               'http://192.168.1.41:4200',
//               'http://localhost:4200'],
//             credentials: true //https://socket.io/docs/v3/using-multiple-nodes/index.html --> Important note: if you are in a CORS situation (the front domain is different from the server domain) and session affinity is achieved with a cookie, you need to allow credentials:
//           },
//           transports: ['websocket'],
//           autoconnect: true
//         });
 

//   io.on('connection', (socket) => {
//     console.log('Client connected');
//     current_users_count ++;
//     console.log(`CURRENT USERS ${current_users_count}`);
//     //console.log('Socket', socket);
//     const id_handshake = socket.id;
//     let {payload} = socket.handshake.query; 
//     console.log('Payload', JSON.parse(payload));
//     let payloadObj =  JSON.parse(payload);

//           socket.emit('message', {
//               msg: `Hola tu eres el dispositivo >>> ${id_handshake} <<< perteneces a la sala [ ${ payloadObj.room} ]`
//           });

//           /* Se emite a todos los clientes */
//           socket.broadcast.emit('message', {
//               msg: `Un nuevo usuario accedió >>> ${id_handshake} <<< a la sala [ ${payloadObj.room} ]`
//           })

//           socket.on('default', function(res){
//             console.log(`>>>>> Received ${res.payload} on 'default' channel`);
//             logger(`New visitor from connection ${id_handshake}`);
//           });

//           socket.on('home', function(res){
//             console.log(`>>>>> Received ${res.payload} on 'home' channel`);
//             logger(`Visitor ${id_handshake} reached HOME`);
//           });

// //       /**
// //        * Si un dispositivo se desconecto lo detectamos aqui
// //        */
//         socket.on('disconnect', function () {
//             console.log(`user ${id_handshake} logged out`);
//             current_users_count--;
//             console.log(`CURRENT USERS ${current_users_count}`);
//             socket.broadcast.emit('message', {
//                 msg: `El usuario >>> ${id_handshake} salió`
//             })
//         });

//   });

//   // setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
// }

// const { logger } =  require ('./helpers/logger')
// let current_users_count = 0;

// startSockets = (app) => {
//     const server = require('http').Server(app)
//     const io = require('socket.io')(server, {
//       cors: {
//         //origins: ['http://localhost:4200'] // local con --host
//         // origins: ['http://192.168.1.41:4200'] // local con --host
//         //origins: ['http://192.168.1.41:3000'] // pre
//         origins: ['https://digitalophy-beta.herokuapp.com']
//       }
//     });
//     const chalk = require('chalk');
    
//     io.on('connection', function (socket) {
    
//       /** handshake: Es el id de conexion con el dispositivo cliente */
//       const id_handshake = socket.id;
//       /** query: En este ejemplo practico queremos enviar una información extra en la conexión
//        * acerca del usuario que esta logeado en el Front. Para ello lo enviamos dentro de un objeto por defecto llamado "query"
//        */
//       let {payload} = socket.handshake.query; 
//       console.log(`${chalk.blue(`Nuevo dispositivo conectado: ${id_handshake}`)}`);
//       console.log('Adress: ' + socket.handshake.address);
//       current_users_count ++;
//       console.log(`${chalk.magenta(`CURRENT USERS ${current_users_count}`)}`);
//       console.log(`CURRENT USERS ${current_users_count}`);
    
//       if (!payload) {
//           console.log(`${chalk.red(`No payload`)}`);  
//       } else {
//           payload = JSON.parse(payload);
//           console.log(payload);
//             /**
//            * Una vez enviado la informacion del usuario conectado en este caso es un peequeño objecto que contiene nombre y id,
//            * creamos una sala y lo unimos https://socket.io/docs/rooms-and-namespaces/
//            */
//           socket.join(payload.room);
//           console.log(`${chalk.yellow(`Client id ${id_handshake} joined ${`room [ ${payload.room} ]`}`)}`);
//           console.log(`Client id ${id_handshake} joined ${`room [ ${payload.room} ]`}`);
//           /**
//            * --------- EMITIR -------------
//            * Para probar la conexion con el dispositivo unico le emitimos un mensaje a el dispositivo conectado
//            */

//           /* Se emite al cliente socket */
//           socket.emit('message', {
//               msg: `Hola tu eres el dispositivo >>> ${id_handshake} <<< perteneces a la sala [ ${payload.room.toUpperCase()} ]`
//           });


//           /* Se emite a todos los clientes */
//           socket.broadcast.emit('message', {
//               msg: `Un nuevo usuario accedió >>> ${id_handshake} <<< a la sala [ ${payload.room.toUpperCase()} ]`
//           })

//           /**
//            * ----------- ESCUCHAR -------------
//            * Cuando el cliente nos emite un mensaje la api los escucha de la siguiente manera
//            */
//           socket.on('default', function(res){
//             console.log(`${chalk.cyanBright(`>>>>> Received ${res.payload} on 'default' channel`)}`);
//             logger(`New visitor from connection ${id_handshake}`);
//           });

//           socket.on('home', function(res){
//             console.log(`${chalk.cyanBright(`>>>>> Received ${res.payload} on 'home' channel`)}`);
//             logger(`Visitor ${id_handshake} reached HOME`);
//           });


//       };
    
//       /**
//        * Si un dispositivo se desconecto lo detectamos aqui
//        */
//         socket.on('disconnect', function () {
//             console.log(`user ${id_handshake} logged out`);
//             current_users_count--;
//             console.log(`${chalk.magenta(`CURRENT USERS ${current_users_count}`)}`);
//             socket.broadcast.emit('message', {
//                 msg: `El usuario >>> ${id_handshake} salió`
//             })
//         });
//     });
    
//     /* Socket server */
//     server.listen(5000, function () {
//       console.log('\n')
//       console.log(`>> Socket listo y escuchando por el puerto: ${chalk.green('5000')}`)
//     })
// }


