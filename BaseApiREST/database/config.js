const mongoose = require('mongoose');
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Base de Datos [ONLINE]");
  } catch (error) {
    console.log(error);
    throw new Error('Error en conexión a base de datos');
  }
}
module.exports = {
  dbConnection
}