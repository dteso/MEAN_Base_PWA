const File = require('../models/file.model');
const { BaseController } = require('./base.controller');
const { deleteFile, buildTree, createFolder, deleteFolder, createFile } = require('../helpers/filetools');
const { logger } = require('../helpers/logger');

class FileController extends BaseController {

    constructor(model) {
        super(model);
    }


    uploadFile = async (req, res) => {
        try{
            if (!req.files || Object.keys(req.files).length === 0) {
                console.log(`! ERROR :  'No file selected'`);
                return res.status(400).json({
                    ok: false,
                    msg: 'No file selected'
                })
            }
            console.log("Folder: " + req.body.folder);   
            //Procesar la imágen
            createFile(req, res);
            
        }catch(err){
            console.log(`! ERROR : ${err}`);
            res.status(500).json({
                ok: false,
                error: `Error during upload process ${err}`
            })
        }


    }


    listFiles = async (req, res)=>{
        try{
            const dbFiles = await File.find({}); 
            const routes = buildTree('./shared');
            console.log(`SUCCESS - FILES were LOADED`);
            res.json({
              ok: true,
              msg: `FILES were LOADED sucessfully`,
              dbFiles,
              routes
            });
        }catch(err){
            console.log(`! ERROR LISTING FILES : ${err}`);
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
            //TODO: Devolver routas por ruta real. Esto implica cambiar la petición a un post y el folder en el body
            const dbFiles = await File.find({ folder }); 
            console.log(`SUCCESS - FILES from folder ${folder} LOADED`);
            res.json({
              ok: true,
              msg: `FILES from folder <${folder}> were LOADED sucessfully`,
              dbFiles,
              routes
            });
        }catch(err){
            console.log(`! ERROR : ${err}`);
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
            //await deleteFile(dbFile.src);
            await File.findByIdAndDelete(uid);
            const routes = buildTree(this.getDirFromFileRoute(dbFile.src));
            console.log(`SUCCESS - File uid=${uid} DELETED sucessfully`);
            return res.json({
              ok: true,
              msg: `File uid=${uid} DELETED sucessfully`,
              file: dbFile,
              routes
            });
        }catch(err){
            console.log(`! ERROR : ${err}`);
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
            console.log(`SUCCESS - Folder src=${req.body.folderSrc} CREATED sucessfully`);
            return res.json({
              ok: true,
              msg: `Folder src=${req.body.folderSrc} CREATED sucessfully`,
              routes
            });
        }catch(err){
            console.log(`! ERROR : ${err}`);
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
            console.log(`SUCCESS - FOLDER src=${req.body.folderSrc} DELETED sucessfully`);
            return res.json({
              ok: true,
              msg: `FOLDER src=${req.body.folderSrc} DELETED sucessfully`,
              routes
            });
        }catch(err){
            console.log(`! ERROR : ${err}`);
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
            console.log(`SUCCESS - build tree loaded`);
            res.json({
                ok: true,
                paths: routes
            })
        }catch(err){
            console.log(`! ERROR : ${err}`);
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