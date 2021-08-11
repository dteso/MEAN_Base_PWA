const fs = require ('fs');

let logContent = [];

logger = (event) => {
    fs.readFile(`${process.env.SHARED_FOLDER}/protected/log.txt`, 'utf-8', (err, data)=> {
        if (err) {
            console.log("Error reading log.txt");
            throw err
        }
        logContent = data;
        date = new Date();
        logContent += `${date.toUTCString()} - ${event}\n`;
        fs.writeFile(`${process.env.SHARED_FOLDER}/protected/log.txt`, logContent, (err)=> {
            if(err) throw new Error ('No se pudo grabar', err);
        });   
    });
}

module.exports = {
    logger
};