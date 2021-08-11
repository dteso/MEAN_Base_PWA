const { response } = require('express');
const File = require('../models/file.model');
const { BaseController } = require('./base.controller');
const { v4: uuidv4 } = require('uuid');
const { deleteFile, buildTree, createFolder, deleteFolder } = require('../helpers/filetools');
const { logger } = require('../helpers/logger');

class FileController extends BaseController {

    constructor(model) {
        super(model);
    }


    uploadFile = async (req, res) => {
        try{
            if (!req.files || Object.keys(req.files).length === 0) {
                logger(`! ERROR :  'No file selected'`);
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
                logger(`! ERROR : 'No extension allowed'`);
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
                    logger(`! ERROR : ${err}`);
                    return res.status(500).json({
                        ok: false,
                        msg: `Error copying file ${err}`
                    });
                }
                let dbFile =  await objectFile.save();
                logger(`File ${fileName} Uploaded`);
                res.json({
                    ok: true,
                    msg: `SUCCESS - File ${fileName} Uploaded`,
                    file: dbFile 
                })
            });
        }catch(err){
            logger(`! ERROR : ${err}`);
            res.status(500).json({
                ok: false,
                error: `Error during upload process ${err}`
            })
        }


    }


    listFiles = async (req, res)=>{
        try{
            const dbFiles = await File.find({}); //Sería como establecer su propio Dto sin necesidad de definirlo. Nos seguiría saliendo el _id y la __v. Esto se soluciona en el user.model.js
            const routes = buildTree('./shared');
            logger(`SUCCESS - FILES were LOADED`);
            res.json({
              ok: true,
              msg: `FILES were LOADED sucessfully`,
              dbFiles,
              routes
            });
        }catch(err){
            logger(`! ERROR : ${err}`);
            res.json({
                ok: false,
                msg: `err`,
              });
        }

    }


    listByFolder = async (req, res)=>{
        try{
            const folder = req.params.folder;
            let routes = [];
            if(folder === 'shared'){
                routes = buildTree('./shared');
            }
            const dbFiles = await File.find({ folder }); //Sería como establecer su propio Dto sin necesidad de definirlo. Nos seguiría saliendo el _id y la __v. Esto se soluciona en el user.model.js
            logger(`SUCCESS - FILES from folder ${folder} LOADED`);
            res.json({
              ok: true,
              msg: `FILES from folder <${folder}> were LOADED sucessfully`,
              dbFiles,
              routes
            });
        }catch(err){
            logger(`! ERROR : ${err}`);
            res.json({
                ok: false,
                msg: `err`,
              });
        }

    }

    deleteFile = async (req,res) => {
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
            const routes = buildTree(this.getDirFromFileRoute(dbFile.src));
            logger(`SUCCESS - File uid=${uid} DELETED sucessfully`);
            return res.json({
              ok: true,
              msg: `File uid=${uid} DELETED sucessfully`,
              file: dbFile,
              routes
            });
        }catch(err){
            logger(`! ERROR : ${err}`);
            res.status(500).json({
                ok: false,
                error: err
            })
        }
    }


    
    createFolder = async (req,res) => {
        try{
            await createFolder(req.body.folderSrc);
            const routes = buildTree(this.getDirFromFileRoute(req.body.folderSrc));
            logger(`SUCCESS - Folder src=${req.body.folderSrc} CREATED sucessfully`);
            return res.json({
              ok: true,
              msg: `Folder src=${req.body.folderSrc} CREATED sucessfully`,
              routes
            });
        }catch(err){
            logger(`! ERROR : ${err}`);
            res.status(500).json({
                ok: false,
                error: err
            })
        }

    }

    deleteFolder = async (req,res) => {
        try{
            await deleteFolder(req.body.folderSrc);
            const routes = buildTree(this.getDirFromFileRoute(req.body.folderSrc));
            console.log(req.body.folderSrc);
            logger(`SUCCESS - FOLDER src=${req.body.folderSrc} DELETED sucessfully`);
            return res.json({
              ok: true,
              msg: `FOLDER src=${req.body.folderSrc} DELETED sucessfully`,
              routes
            });
        }catch(err){
            logger(`! ERROR : ${err}`);
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
            logger(`SUCCESS - build tree loaded`);
            res.json({
                ok: true,
                paths: routes
            })
        }catch(err){
            logger(`! ERROR : ${err}`);
            res.status(400).json({
                ok: false,
                error: err
            })
        }
        
    }


    getDirFromFileRoute(route){
        let splittedRoute =  route.split('/');
        splittedRoute.pop();
        return splittedRoute.join('/');
    }

}


module.exports = {
    FileController
}