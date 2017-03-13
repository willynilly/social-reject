const fs = require('fs');

function writeToFile(fileName, data) {
    let d = new Date();
    let dateString = d.getTime() + '_' + d.toString().split(' ').join('_') + '.json';
    return new Promise((resolve, reject) => {
        fs.writeFile('./' + fileName + '_' + dateString, JSON.stringify(data), function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


module.exports = {
    writeToFile: writeToFile
}