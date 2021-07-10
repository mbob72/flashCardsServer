const heightInLines = 5

function toView(linesByArrs, ifEng) {

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
                memo.push({text: divide(word, ifEnd)})
            }
            return memo
        }, []))
        return memo
    }, [])

    return {text}
}

function divide(word, ifEnd) {
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
    makePdfData
}
