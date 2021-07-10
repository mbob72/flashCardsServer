const fs = require('fs')
var path = require('path');

const root = path.join(__dirname, '..', 'textData')

async function readRowDict(...pathToFile) {
    const jsonPath = path.join(root, ...pathToFile);
    const file = await fs.promises.readFile(jsonPath, 'utf8' )
    console.log(file)
    return file
}
async function searchFileByFirstNum(firstNum) {
    const files = await fs.promises.readdir(root);
    const fileName = files.find(fileName => fileName.split('-')[0] === firstNum)
    if(fileName) {
        return fileName.split('-')[1].split('.')[0]
    }
    return null
}

module.exports = {
    searchFileByFirstNum,
    readRowDict
}

