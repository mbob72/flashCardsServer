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
                word[nowFaze].push(checkHighlights(nextWord, nowFaze))
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

function checkHighlights(word, faze) {
    if (faze !== 2) return word
    const parts = word.split(/\t/)
    return parts.length > 1 ? parts.filter(i => !!i) : parts[0]
}


module.exports = {
    makeModel
}
