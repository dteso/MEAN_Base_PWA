var fs = require('fs');

class TreeNode {
    path;
    children;
  
    constructor(path) {
      this.path = path;
      this.children = [];
    }
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
    deleteFile,
    buildTree,
    createFolder,
    deleteFolder
}