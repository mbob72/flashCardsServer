const heightInLines = 6

function makePdfData({viewModel}) {
    return viewModel.reduce((memo, word, index) => {
            if (index % 2) {
                memo.slice(-1)[0].push(word)
            } else {
                memo.push([word])
            }
            return memo
        }, [])
        .map(pare => pare
            .reduce((memo, {ru, en}) => {
                memo.push(toView(en, true))
                memo.push(toView(ru))
                return memo
            }, [])
        )
}

function cutLines(linesGroup, linesRestriction) {
    const { data: newLinesGroup, counter } = linesGroup.reduce((memo, group) => {
        const { lines, printGray } = group
        if(memo.counter >= linesRestriction) {
            return memo
        }
        if(printGray && (memo.counter + lines.length >= linesRestriction)) {
            lines.length = linesRestriction - memo.counter
        }
        memo.data.push(group)
        memo.counter += lines.length
        return memo
    }, { counter: 0, data: []})
    if(counter > linesRestriction || !newLinesGroup.length) {
        throw new Error('Слишком много строк')
    }
    return {
        totalLines: counter,
        linesByArrs: newLinesGroup
    }
}

function makeLayout(groups, ifEng, totalLines) {
    if(ifEng) {
        switch (totalLines) {
            case 4:
                groups[0].lines.splice(1, 0, [' '])
                return
            case 3:
                groups[0].lines.splice(1, 0, [' '])
                groups[0].lines.splice(1, 0, [' '])
                return
        }
    } else {
        switch (totalLines) {
            case 1:
            case 2:
                groups[0].lines.splice(0, 0, [' '])
                groups[0].lines.splice(0, 0, [' '])
                return
            case 3:
            case 4:
                groups[0].lines.splice(0, 0, [' '])
                return

        }
    }
}

function toView(preLinesByArrs, ifEng) {
    const { totalLines, linesByArrs } = cutLines(preLinesByArrs, heightInLines)
    makeLayout(linesByArrs, ifEng, totalLines)
    const text = linesByArrs.reduce((memo, group) => {
        const {lines, printGray } = group
        const textFromGroup = lines
            // if it wos divided by tabs, rejoin it
            .map(line =>
                line
                    .map(word =>
                        Array.isArray(word)
                            ? word.join('')
                            : word)
                    .join(' ')
            )
            .join('\n') + '\n'
        const part = printGray ? { text: textFromGroup, color: 'gray' } : textFromGroup
        memo.push(part)
        return memo
    }, [])

    return {text}
}


module.exports = {
    makePdfData
}
