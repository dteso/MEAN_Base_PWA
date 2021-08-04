const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const googleVerify = async( id_token = '') => {
  const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const { 
      name,
      picture: img, 
      email} = ticket.getPayload(); //Aquí viene toda la informacion del usuario
  return {name, img, email};
}

module.exports = {
    googleVerify
}