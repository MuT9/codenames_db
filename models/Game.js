const mongoose = require('mongoose');

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

const Game = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model('Game', Game);