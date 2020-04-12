const { COLORS, DICTIONARY, DEFAULT_WORDS_COUNT } = require('../constants');  

const generateField = (wordsCount = DEFAULT_WORDS_COUNT) => {
    const words = DICTIONARY.sort(() => Math.random() - 0.5).slice(0, wordsCount);
    const colors = COLORS.sort(() => Math.random() - 0.5).slice(0, wordsCount);

    return words.map((word, index) => ({
        word,
        color: colors[index]
    }))
}

const generateTeams = players => {
    const shuffledPlayers = players.sort(() => Math.random() - 0.5);
    const captainRed = shuffledPlayers[0];
    const captainBlue = shuffledPlayers[1];
    const restPlayers = shuffledPlayers.slice(2,shuffledPlayers.length);
    const separatorIndex = Math.floor(restPlayers.length/2);
    const teamBlue = restPlayers.slice(0, separatorIndex);

    if (restPlayers.length % 2 === 0) {
        return {
            captainRed,
            captainBlue,
            teamBlue,
            teamRed: restPlayers.slice(separatorIndex, restPlayers.length)
        }
    }

    const teamRed = restPlayers.slice(separatorIndex, restPlayers.length - 1);

    if (Math.random() < 0.5) {
        teamBlue.push(restPlayers[restPlayers.length - 1]);
    } else {
        teamBlue.push(restPlayers[restPlayers.length - 1]);
    }

    return {
        captainRed,
        captainBlue,
        teamBlue,
        teamRed
    }
};

module.exports = {
    generateField,
    generateTeams
}