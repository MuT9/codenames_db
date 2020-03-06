const mongoose = require('mongoose');

class Game {
    async createGame() {
        return this
    }

    updateScore(team) {
        this.score = {
            ...this.score,
            [team]: this.score[team] + 1
        };
    }

    async makeMove(requestWord) {
        const wordObject = this.words.find(wordObject => requestWord === wordObject.word);

        if (!wordObject) {
            throw new Error('There is no such word');
        }

        if (wordObject.guessed) {
            throw new Error('Word already guessed');
        }

        wordObject.guessed = true;

        if (wordObject.color === 'black') {
            this.gameOver = true;

            await this.save();

            return wordObject;
        }

        if (wordObject.color === 'gray') {
            this.turnOver();

            await this.save();

            return wordObject;
        }

        this.updateScore(wordObject.color);
        this.hintCount-=1;

        if (this.turn != wordObject.color || this.hintCount < 1) {
            this.turnOver();
        }

        await this.save();

        return wordObject;
    }

    async checkForGameOver() {
        if (this.score.red > 8 || this.score.blue > 7 || this.words.some(word => word.color === 'black' && word.guessed)) {
            this.gameOver = true;

            await this.save();
        }
    }

    generateField(wordsCount = DEFAULT_WORDS_COUNT) {
        const words = DICTIONARY.sort(() => Math.random() - 0.5).slice(0, wordsCount);
        const colors = COLORS.sort(() => Math.random() - 0.5).slice(0, wordsCount);

        return words.map((word, index) => ({
            word,
            color: colors[index]
        }))
    };

    getAllPlayers() {
        return [...this.teamRed, ...this.teamBlue, this.captainRed, this.captainBlue].filter(id => !!id);
    }

    turnOver() {
        this.turn = this.turn === 'red' ? 'blue' : 'red';
        this.hintCount = 0;
        this.hintWord = '';
    }
}

//TODO Подключить typescript
//TODO Валидация полей

const WordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    guessed: {
        type: Boolean,
        default: false
    }
});

const GameSchema = new mongoose.Schema({
    words: {
        type: [WordSchema],
        required: true
    },
    gameOver: {
        type: Boolean,
        default: false
    },
    score: {
        red: {
            type: Number,
            default: 0
        },
        blue: {
            type: Number,
            default: 0
        }
    },
    captainRed: {
        type: String,
        default: ''
    },
    captainBlue: {
        type: String,
        default: ''
    },
    teamRed: {
        type: [String],
        default: []
    },
    teamBlue: {
        type: [String],
        default: []
    },
    turn: {
        type: String,
        default: 'red'
    },
    hintWord: {
        type: String,
        default: ''
    },
    hintCount: {
        type: Number,
        default: 0
    }
});

GameSchema.loadClass(Game);

module.exports = mongoose.model('Game', GameSchema);