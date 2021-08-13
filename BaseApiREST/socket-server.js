
/*
 * -------- socket io connection---------*/

const { logger } =  require ('./helpers/logger')

startSockets = (app) => {

    const server = require('http').Server(app)
    const io = require('socket.io')(server, {
      cors: {
        origins: ['http://192.168.1.41:4200'] // Hay que permitir las cors para leol host del front
      }
    });
    const chalk = require('chalk');
    
    io.on('connection', function (socket) {
    
      console.log("New connection");
      /** handshake: Es el id de conexion con el dispositivo cliente */
      const id_handshake = socket.id;
      /** query: En este ejemplo practico queremos enviar una información extra en la conexión
       * acerca del usuario que esta logeado en el Front. Para ello lo enviamos dentro de un objeto por defecto llamado "query"
       */
      let {payload} = socket.handshake.query; 
      console.log(`${chalk.blue(`Nuevo dispositivo conectado: ${id_handshake}`)}`);
      console.log('Adress: ' + socket.handshake.address);
      console.log(`Payload ${payload}`);
    
      if (!payload) {
          console.log(`${chalk.red(`Sin payload`)}`);  
      } else {
          payload = JSON.parse(payload);
            /**
           * Una vez enviado la informacion del usuario conectado en este caso es un peequeño objecto que contiene nombre y id,
           * creamos una sala y lo unimos https://socket.io/docs/rooms-and-namespaces/
           */
          socket.join(`room_${payload.id}`);
          console.log(`${chalk.yellow(`El dispositivo ${id_handshake} se unio a -> ${`room_${payload.id}`}`)}`);
    
          /**
           * --------- EMITIR -------------
           * Para probar la conexion con el dispositivo unico le emitimos un mensaje a el dispositivo conectado
           */
          socket.emit('message', {
              msg: `Hola tu eres el dispositivo ${id_handshake}, perteneces a la sala room_${payload.id}, de ${payload.user}`
          });
    
          /**
           * ----------- ESCUCHAR -------------
           * Cuando el cliente nos emite un mensaje la api los escucha de la siguiente manera
           */


          socket.on('default', function(res){
            console.log(`${chalk.cyanBright(`>>>>> Received ${res.payload} on 'default' channel`)}`);
            logger(`New visitor from connection ${id_handshake}`);
          });

      };
    
      /**
       * Si un dispositivo se desconecto lo detectamos aqui
       */
      socket.on('disconnect', function () {
          console.log('user disconnected');
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


