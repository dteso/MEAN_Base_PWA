
/*
 * -------- socket io connection---------*/

const { logger } =  require ('./helpers/logger')
let current_users_count = 0;

startSockets = (app) => {
    const server = require('http').Server(app)
    const io = require('socket.io')(server, {
      cors: {
        origins: ['http://192.168.1.41:4200'] // Hay que permitir las cors para el host del front
      }
    });
    const chalk = require('chalk');
    
    io.on('connection', function (socket) {
    
      /** handshake: Es el id de conexion con el dispositivo cliente */
      const id_handshake = socket.id;
      /** query: En este ejemplo practico queremos enviar una información extra en la conexión
       * acerca del usuario que esta logeado en el Front. Para ello lo enviamos dentro de un objeto por defecto llamado "query"
       */
      let {payload} = socket.handshake.query; 
      console.log(`${chalk.blue(`Nuevo dispositivo conectado: ${id_handshake}`)}`);
      console.log('Adress: ' + socket.handshake.address);
      current_users_count ++;
      console.log(`${chalk.magenta(`CURRENT USERS ${current_users_count}`)}`);
    
      if (!payload) {
          console.log(`${chalk.red(`No payload`)}`);  
      } else {
          payload = JSON.parse(payload);
          console.log(payload);
            /**
           * Una vez enviado la informacion del usuario conectado en este caso es un peequeño objecto que contiene nombre y id,
           * creamos una sala y lo unimos https://socket.io/docs/rooms-and-namespaces/
           */
          socket.join(payload.room);
          console.log(`${chalk.yellow(`Client id ${id_handshake} joined ${`room [ ${payload.room} ]`}`)}`);
          /**
           * --------- EMITIR -------------
           * Para probar la conexion con el dispositivo unico le emitimos un mensaje a el dispositivo conectado
           */

          /* Se emite al cliente socket */
          socket.emit('message', {
              msg: `Hola tu eres el dispositivo >>> ${id_handshake} <<< perteneces a la sala [ ${payload.room.toUpperCase()} ]`
          });


          /* Se emite a todos los clientes */
          socket.broadcast.emit('message', {
              msg: `Un nuevo usuario accedió >>> ${id_handshake} <<< a la sala [ ${payload.room.toUpperCase()} ]`
          })

          /**
           * ----------- ESCUCHAR -------------
           * Cuando el cliente nos emite un mensaje la api los escucha de la siguiente manera
           */
          socket.on('default', function(res){
            console.log(`${chalk.cyanBright(`>>>>> Received ${res.payload} on 'default' channel`)}`);
            logger(`New visitor from connection ${id_handshake}`);
          });

          socket.on('home', function(res){
            console.log(`${chalk.cyanBright(`>>>>> Received ${res.payload} on 'home' channel`)}`);
            logger(`Visitor ${id_handshake} reached HOME`);
          });


      };
    
      /**
       * Si un dispositivo se desconecto lo detectamos aqui
       */
        socket.on('disconnect', function () {
            console.log(`user ${id_handshake} logged out`);
            current_users_count--;
            console.log(`${chalk.magenta(`CURRENT USERS ${current_users_count}`)}`);
            socket.broadcast.emit('message', {
                msg: `El usuario >>> ${id_handshake} salió`
            })
        });
    });
    
    /* Socket server */
    server.listen(5000, function () {
      console.log('\n')
      console.log(`>> Socket listo y escuchando por el puerto: ${chalk.green('5000')}`)
    })
}

module.exports = {
    startSockets
}


