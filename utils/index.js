const { COLORS, DICTIONARY, DEFAULT_WORDS_COUNT } = require('../constants');  

const generateField = (wordsCount = DEFAULT_WORDS_COUNT) => {
    const words = DICTIONARY.sort(() => Math.random() - 0.5).slice(0, wordsCount);
    const colors = COLORS.sort(() => Math.random() - 0.5).slice(0, wordsCount);

    return words.map((word, index) => ({
        word,
        color: colors[index]
    }))
}

module.exports = {
    generateField
}