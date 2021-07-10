const enLength = 21
const ruLength = 15

function makeViewLines(model) {
    const data = {model}
    const viewModel = []
    model.forEach(line => {
        const item = {}
        item.en = makeEn(line)
        item.ru = makeRu(line)
        viewModel.push(item)
    })

    return {
        ...data,
        viewModel
    }
}

function makeEn({word, index}) {
    const res = []
    res.push([index])
    res.push(...makeStricktLines(word[1], enLength))
    res.push(...makeStricktLines(word[2], enLength))
    res.push(...makeStricktLines(word[3], ruLength))
    return res
}

function makeRu({word, index}) {
    return makeStricktLines(word[0], ruLength)
}

function makeStricktLines(words, len) {
    const lines = []
    // если есть оч длинные слова
    words.forEach(word => {
        if (word.length > len) {
            throw new Error('Длинное слово ' + word)
        }
    })

    const _words = [...words].reverse()
    while (_words.length > 0) {
        const currentLine = []
        do {
            currentLine.push(_words.slice(-1)[0])
            _words.length = _words.length - 1
        } while (_words.length && (getLength(currentLine, true) + getLength(_words.slice(-1)[0], false) + 1 <= len))
        lines.push(currentLine)
    }
    return lines
}

// аргумент = массив иди строка
function getLength(arrOrStr, ifSpace) {
    if (typeof arrOrStr === 'string') {
        return arrOrStr.length
    }
    let res = 0
    arrOrStr.forEach(item => {
        res = res + getLength(item) + (ifSpace ? 1 : 0)
    })
    return res
}


module.exports = {
    makeViewLines
}
