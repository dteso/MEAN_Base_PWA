
const { BaseController } = require('./base.controller');
const { sendCustomMail } = require('../helpers/mail');

class DispatcherController extends BaseController {

    sendMail = async (req, res) => {
        const {to ,subject, body} = req.body;
        try{
            sendCustomMail('MY SYSTEM', to, subject, body);
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