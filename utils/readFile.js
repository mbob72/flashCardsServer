const fs = require('fs')
var path = require('path');


module.exports = {
    readRowDict: async function readRowDict(...pathToFile) {
        const jsonPath = path.join(__dirname, '..', 'textData', ...pathToFile);
        const file = await fs.promises.readFile(jsonPath, 'utf8' )
        console.log(file)
        return file
    }
}

