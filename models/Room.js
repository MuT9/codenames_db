const mongoose = require('mongoose');

class Room {

}

const playerSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    }

})

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
        type: [playerSchema]
    }
});

roomSchema.loadClass(Room);

module.exports = mongoose.model('rooms', roomSchema);



