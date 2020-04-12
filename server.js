const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const gamesRouter = require('./routes/games');
const roomRouter = require('./routes/rooms');

const PORT = process.env.PORT || 1337;
const HOST = process.env.HOST || '0.0.0.0';
const DB_URI = process.env.DB_URI || 'mongodb://admin:Admin1@ds163494.mlab.com:63494/codenames';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/rooms', roomRouter);
app.use('/games', gamesRouter);

app.listen(PORT, HOST, async () => {
    try {
        await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

        console.log(`Listening on ${HOST}:${PORT}`)
        console.log('Successfully connected to database');
    } catch (e) {
        console.error(e);
    }
});
