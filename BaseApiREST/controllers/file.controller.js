const { response } = require('express');
const { BaseController } = require('./base.controller');
const { v4: uuidv4 } = require('uuid');

class FileController extends BaseController {

    constructor(model) {
        super(model);
    }


    uploadFile = (req, res) => {
        console.log("En el controller");
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No file selected'
            })
        }

        //Procesar la imágen
        const file = req.files.image;

        //Extraer extension
        const spliitedFileName = file.name.split('.');
        const extension = spliitedFileName[spliitedFileName.length - 1];

        //Validar extension
        const validExtensions = ['png', 'jpg', 'jpeg', 'png', 'gif', 'pdf'];
        if (!validExtensions.includes(extension)) {
            return res.status(400).json({
                ok: false,
                msg: 'No extension allowed'
            })
        }

        //Generar nombre único del archivo
        const fileName = `${uuidv4()}.${extension}`;

        //Path para guardar la imagen
        const path = `./shared/images/${fileName}`;

        // Use the mv() method to place the file somewhere on your server
        file.mv(path, (err) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    msg: err
                });
            }
            res.json({
                ok: true,
                msg: `YEAHHHHH!!! File ${fileName} Uploaded`
            })
        });

    }

}


module.exports = {
    FileController
}