const mongoose = require('mongoose');

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

});

module.exports = playerSchema;