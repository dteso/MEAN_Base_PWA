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

// walkSync = (dir, filelist) => {
//     var path = path || require('path');
//     var fs = fs || require('fs'),
//         files = fs.readdirSync(dir);
//     filelist = filelist || [];
//     files.forEach(function(file) {
//         if (fs.statSync(path.join(dir, file)).isDirectory()) {
//             filelist = walkSync(path.join(dir, file), filelist);
//         }
//         else {
//             filelist.push(path.join(dir, file));
//         }
//     });
//     console.log(filelist);
//     return filelist;
// };


buildTree = (rootPath) => {
    console.log("Build tree called");
    const root = new TreeNode(rootPath);
    console.log(root);
    const stack = [root];
  
    while (stack.length) {
      const currentNode = stack.pop();
      console.log("current node", currentNode);
  
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
  }

module.exports = {
    deleteFile,
    buildTree
}