const { response } = require('express');
const File = require('../models/file.model');
const { BaseController } = require('./base.controller');
const { v4: uuidv4 } = require('uuid');

class FileController extends BaseController {

    constructor(model) {
        super(model);
    }


    uploadFile = async (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No file selected'
            })
        }

        //Procesar la imágen
        const file = req.files.image;

        //Extraer extension
        const splittedFilename = file.name.split('.');
        const extension = splittedFilename[splittedFilename.length - 1];

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
        const path = `./shared/images/${req.params.folder}/${fileName}`;

        const objectFile = new File({
            name: splittedFilename[0],
            type: extension,
            src: path,
            folder: req.params.folder
        });

        // Use the mv() method to place the file somewhere on your server
        file.mv(path, async (err) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    msg: err
                });
            }

            let dbFile =  await objectFile.save();

            res.json({
                ok: true,
                msg: `SUCCESS - File ${fileName} Uploaded`,
                file: dbFile 
            })
        });

    }


    listFiles = async (req, res)=>{
        console.log("FILES GET REQUEST");
        const dbFiles = await File.find({}); //Sería como establecer su propio Dto sin necesidad de definirlo. Nos seguiría saliendo el _id y la __v. Esto se soluciona en el user.model.js
        res.json({
          ok: true,
          msg: `FILES were LOADED sucessfully`,
          dbFiles
        });
    }


    listByFolder = async (req, res)=>{
        console.log("FILE BY FOLDER GET REQUEST");

        const folder = req.params.folder;
        const dbFiles = await File.find({ folder }); //Sería como establecer su propio Dto sin necesidad de definirlo. Nos seguiría saliendo el _id y la __v. Esto se soluciona en el user.model.js
        res.json({
          ok: true,
          msg: `FILES from folder <${folder}> were LOADED sucessfully`,
          dbFiles
        });
    }

}


module.exports = {
    FileController
}