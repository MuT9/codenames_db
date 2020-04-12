const mongoose = require('mongoose');

const PlayerSchema = require('./PlayerSchema');

class Room {

}

const roomSchema = new mongoose.Schema({
    chat_id: {
        type: String,
        required: true,
        unique: true
    },
    in_game: {
        type: Boolean,
        default: false
    },
    players: {
        type: [PlayerSchema]
    }
});

roomSchema.loadClass(Room);

module.exports = mongoose.model('rooms', roomSchema);



