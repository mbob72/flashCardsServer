const {readRowDict} = require("./readFile");

const enLength = 21
const ruLength = 15
const heightInLines = 5

function checkFaze(word) {
    const T = word.trim()[0] === '[' ? 'T' : ''
    if (T) {
        return checkRu(word) ? 3 : 2
    }
    return checkEn(word) ? 1 : 0
}

function checkEn(word) {
    return word.match(/[A-Z,a-z]/)
}

function checkRu(word) {
    return word.match(/[АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЪЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщыъьэюя]/)
}

function checkHilights(word, faze) {
    if (faze !== 2) return word
    const parts = word.split(/\t/)
    return parts.length > 1 ? parts.filter(i => !!i) : parts[0]
}

function makeModel(text, start) {
    const arr = text.split(/ |\n/)
    arr.reverse()
    const lines = []
    // первый массив - английское слово или слова
    // второй массив - транскрипция на англиском
    // третий массив - траскрипция на русском
    // четвертый массив - перевод на русский
    let word = [[], [], [], []]
    let index = start
    while (arr.length > 0) {
        let currentFaze = 0
        let nextFaze = 1
        while (nextFaze <= 4 && arr.length > 0) {
            const nextWord = arr[arr.length - 1]
            const nowFaze = checkFaze(nextWord)
            if (nowFaze === currentFaze) {
                word[nowFaze].push(checkHilights(nextWord, nowFaze))
                arr.length = arr.length - 1
            } else {
                currentFaze = nowFaze
                nextFaze++
            }
        }
        lines.push({word, index})
        index++
        word = [[], [], [], []]
    }

    return {
        model: lines, start, end: index
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

function makeViewLines(model) {
    const data = {model}
    viewModel = []
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

function toView(linesByArrs, ifEng) {
    console.log('ifEng::', ifEng, linesByArrs)
    if (linesByArrs.length >= heightInLines) {
        linesByArrs.length = heightInLines
    } else if (linesByArrs.length > 3) {
        linesByArrs.splice(1, 0, [' '])
    } else {
        linesByArrs.splice(0, 0, [' '])
        if (linesByArrs.length === 1)
            linesByArrs.splice(0, 0, [' '])
    }
    const text = linesByArrs.reduce((memo, line) => {
        memo.push(...line.reduce((memo, word, index) => {
            const ifEnd = line.length === index + 1
            if (!Array.isArray(word)) {
                memo.push(word + (ifEnd ? '\n' : ' '))
            } else {
                memo.push({text: devide(word, ifEnd)})
            }
            return memo
        }, []))
        return memo
    }, [])

    return {text}
}

function devide(word, ifEnd) {
    return word.reduce((memo, part, ind) => {
        const ifEnd2 = word.length === ind + 1
        const sign = !ifEnd2 ? '' : ifEnd ? '\n' : ' '
        if (ind % 2) {
            memo.push(part + sign)
        } else {
            memo.push({text: part + sign, color: 'gray'})
        }
        return memo
    }, [])
}

function makePdfData({viewModel}) {
    return viewModel.reduce((memo, word, index) => {
        if (index % 2) {
            memo.slice(-1)[0].push(word)
        } else {
            memo.push([word])
        }
        return memo
    }, []).map(pare => {
        return pare.reduce((memo, {ru, en}) => {
            memo.push(toView(en, true))
            memo.push(toView(ru))
            return memo
        }, [])
    })

}

module.exports = {
    makePdfJson: async function makePdfJson(start, end) {
        const text = await readRowDict(`${start}-${end}.txt`)
        const {model, start: _start} = makeModel(text, start)
        console.log('the model is:', model, start, end)
        const data = makeViewLines(model)
        console.log('view::', data)
        const pdfData = makePdfData(data)
        console.log('pdf::', pdfData)
        return pdfData
    }
}


