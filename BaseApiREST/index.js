require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//CREACIÓN DEL SERVIDOR EXPRESS
const app = express();
const appShared = express();

//CONFIGURAR CORS
app.use(cors());

//PARSEO DEL BODY
app.use(express.json());

appShared.use('/shared', express.static('shared'));
app.use('/api', appShared);

//CONEXIÓN BASE DE DATOS
dbConnection();

//RUTAS
app.use('/api/users', require('./routes/user.route'));
app.use('/api/login', require('./routes/auth.route'));
app.use('/dispatcher/alarm', require('./routes/dispatcher.route'));
app.use('/api/notifications', require('./routes/newsletter.route'));
app.use('/api/upload', require('./routes/file.route'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});