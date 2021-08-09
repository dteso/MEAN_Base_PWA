const { response } = require('express');
const File = require('../models/file.model');
const { BaseController } = require('./base.controller');
const { v4: uuidv4 } = require('uuid');
const { deleteFile, buildTree } = require('../helpers/filetools');

class FileController extends BaseController {

    constructor(model) {
        super(model);
    }


    uploadFile = async (req, res) => {
        try{
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No file selected'
                })
            }
            console.log("Folder: " + req.body.folder);
    
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
            const path = `${req.body.folder}/${fileName}`;
            console.log(path);
            const objectFile = new File({
                name: splittedFilename[0],
                type: extension,
                src: path,
                folder: (req.body.folder.split('/'))[(req.body.folder.split('/')).length - 1]
            });
            // Use the mv() method to place the file somewhere on your server
            file.mv(path, async (err) => {
                if (err){
                    return res.status(500).json({
                        ok: false,
                        msg: `Error copying file ${err}`
                    });
                }
                let dbFile =  await objectFile.save();
                res.json({
                    ok: true,
                    msg: `SUCCESS - File ${fileName} Uploaded`,
                    file: dbFile 
                })
            });
        }catch(err){
            res.status(500).json({
                ok: false,
                error: `Error during upload process ${err}`
            })
        }


    }


    listFiles = async (req, res)=>{
        console.log("FILES GET REQUEST");
        const dbFiles = await File.find({}); //Sería como establecer su propio Dto sin necesidad de definirlo. Nos seguiría saliendo el _id y la __v. Esto se soluciona en el user.model.js
        const routes = buildTree('./shared');
        res.json({
          ok: true,
          msg: `FILES were LOADED sucessfully`,
          dbFiles,
          routes
        });
    }


    listByFolder = async (req, res)=>{
        console.log("FILE BY FOLDER GET REQUEST");
        const folder = req.params.folder;
        let routes = [];
        if(folder === 'shared'){
            routes = buildTree('./shared');
        }
        const dbFiles = await File.find({ folder }); //Sería como establecer su propio Dto sin necesidad de definirlo. Nos seguiría saliendo el _id y la __v. Esto se soluciona en el user.model.js
        res.json({
          ok: true,
          msg: `FILES from folder <${folder}> were LOADED sucessfully`,
          dbFiles,
          routes
        });
    }

    deleteFile = async (req,res) => {
        console.log("FILE DELETE REQUEST");
        try{
            const uid = req.params.uid;
            const dbFile = await File.findById(uid);
            if(!dbFile){
                return res.status(400).json({
                    ok: false,
                    error: 'File not found'
                });
            }
            await deleteFile(dbFile.src);
            await File.findByIdAndDelete(uid);
            return res.json({
              ok: true,
              msg: `File uid=${uid} DELETED sucessfully`,
              file: dbFile
            });
        }catch(err){
            res.status(500).json({
                ok: false,
                error: err
            })
        }

    }

    getFolderStructure = (req,res) => {
        const root = req.body.path;
        try{
            const routes = buildTree(root);
            res.json({
                ok: true,
                paths: routes
            })
        }catch(err){
            res.status(400).json({
                ok: false,
                error: err
            })
        }
        
    }

}


module.exports = {
    FileController
}