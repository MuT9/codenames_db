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
    const captain_red = shuffledPlayers[0];
    const captain_blue = shuffledPlayers[1];
    const restPlayers = shuffledPlayers.slice(2,shuffledPlayers.length);
    const separatorIndex = Math.floor(restPlayers.length/2);
    const team_blue = restPlayers.slice(0, separatorIndex);

    if (restPlayers.length % 2 === 0) {
        return {
            captain_red,
            captain_blue,
            team_blue,
            team_red: restPlayers.slice(separatorIndex, restPlayers.length)
        }
    }

    const team_red = restPlayers.slice(separatorIndex, restPlayers.length - 1);

    if (Math.random() < 0.5) {
        team_blue.push(restPlayers[restPlayers.length - 1]);
    } else {
        team_red.push(restPlayers[restPlayers.length - 1]);
    }

    return {
        captain_red,
        captain_blue,
        team_blue,
        team_red
    }
};

module.exports = {
    generateField,
    generateTeams
}