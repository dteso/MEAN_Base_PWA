
const { BaseController } = require('./base.controller');
const { sendCustomMail } = require('../helpers/mail');

class DispatcherController extends BaseController {

    sendMail = async (req, res) => {
        try{
            sendCustomMail('MY SYSTEM', 'dtesodev@gmail.com', 'INTRUSIÓN DETECTADA', 'Se ha detectado un salto de alarma, por favor, revise su App');
            console.log("Enviado Email de aviso");
            res.json({
                ok: true,
                msg: 'Received request to post Mail'
            })
        }catch(error){
            res.status(500).json({
                ok: false,
                error
            });
        }
    }

}

module.exports = {
    DispatcherController
  }