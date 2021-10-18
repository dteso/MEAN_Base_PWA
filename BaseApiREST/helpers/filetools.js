var fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/file.model');

class TreeNode {
    path;
    children;
  
    constructor(path) {
      this.path = path;
      this.children = [];
    }
  }

createFile = (req, res) => {
    const file = req.files.image;
    //Extraer extension
    const splittedFilename = file.name.split('.');
    const extension = splittedFilename[splittedFilename.length - 1];

    //Validar extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'png', 'gif', 'pdf'];
    if (!validExtensions.includes(extension)) {
        console.log(`! ERROR : 'No extension allowed'`);
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

    // Vamos a guardar la imágen temporalmente, en una ruta correspondiente
    // al árbol dentro de la carpeta shared ( carpeta pública ). Esto lo haremos para 
    // poder leer con readFileSync desde la carpeta y poser establecerlo como data de nuestra imágen en BD.
    // A continuación borramos la imágen de la carpeta pues ya podremos cargarla directamente de BD
    file.mv(path, async (err) => {
        if (err){
            console.log(`! ERROR : ${err}`);
            return res.status(500).json({
                ok: false,
                msg: `Error copying file ${err}`
            });
        }
        const objectFile = new File({
            name: splittedFilename[0],
            type: extension,
            src: path,
            folder: (req.body.folder.split('/'))[(req.body.folder.split('/')).length - 1],
            catalog: req.body.catalog,
            img:{
                data: fs.readFileSync(path), //leeemos síncronamente el data de la carpeta en la que hemos guardado la imágen temporalmente, de esa forma lo tendremos disponible seguro al cargarse para establecerlo en el data
                contentType: "image"
            }
        });
        let dbFile =  await objectFile.save(); //Guardamos la imágen en base de datos
        deleteFile(dbFile.src); //Borramos de disco

        return res.json({
            ok: true,
            msg: `SUCCESS - File ${fileName} Uploaded`,
            file: dbFile 
        });
    });
}

// delete file named 'sample.txt'

deleteFile = (filePath) => {
    try{
        fs.unlink(filePath, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    }catch(err){
        console.log(err);
    }
}

createFolder = (folderPath) => {
    console.log(folderPath);
    try{
        if (!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath, { recursive: true });
        }
    }catch(err){
        console.log("Error creating folder" + err);
    }
}

deleteFolder = (folderPath) => {
    console.log(folderPath);
    try{
        fs.rmSync(folderPath, { recursive: true });
    }catch(err){
        console.log("Error deleting folder" + err);
    }
}

buildTree = (rootPath) => {
    //console.log("Build tree called");
    if (fs.existsSync(rootPath)){
        const root = new TreeNode(rootPath);
        //console.log(root);
        const stack = [root];
      
        while (stack.length) {
          const currentNode = stack.pop();
          //console.log("current node", currentNode);
      
          if (currentNode) {
            const children = fs.readdirSync(currentNode.path);
      
            for (let child of children) {
              const childPath = `${currentNode.path}/${child}`;
              const childNode = new TreeNode(childPath);
              currentNode.children.push(childNode);
      
              if (fs.statSync(childNode.path).isDirectory()) {
                stack.push(childNode);
              }
            }
          }
        }
        // console.log(root);
        return root;
    }else{
        console.log("Deprecated route");
    }

  }

module.exports = {
    createFile,
    deleteFile,
    buildTree,
    createFolder,
    deleteFolder
}