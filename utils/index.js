const {makePdfData} = require("./makePdfData");
const {makeViewLines} = require("./makeViewLines");
const {makeModel} = require("./makeModel");
const {readRowDict, searchFileByFirstNum} = require("./readFile");

async function makePdfJson(start) {
    const end = await searchFileByFirstNum(start)
    const text = await readRowDict(`${start}-${end}.txt`)

    const {model} = makeModel(text, start)

    const data = makeViewLines(model)

    const pdfData = makePdfData(data)

    return pdfData
}

module.exports = {
    makePdfJson
}


