const mongoose = require('mongoose');

class Game {
    async setHint(word, count) {
        this.hintWord = word;
        this.hintCount = count;

        await this.save();
    }

    async addPlayer(playerId, role) {
        if (Array.isArray(this[role])) {
            this[role].push(playerId);
        } else {
            this[role] = playerId;
        }

        await this.save();
    }

    checkForGameOver() {
        return this.score.red > 8 || this.score.blue > 7 || this.words.some(word => word.color === 'black' && word.guessed);
    }

    getAllPlayers() {
        return [...this.teamRed, ...this.teamBlue, this.captainRed, this.captainBlue].filter(id => !!id);
    }

    turnOver() {
        this.turn = this.turn === 'red' ? 'blue' : 'red';
    }
}

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