const { Router } = require('express');
const Game = require('../models/Game');
const Room = require('../models/Room');

const gamesRouter = new Router();

// TODO сделать нормальный генератор ответа
const generateAnswer = (success = false, res = null, err = null) => ({
    success,
    result: res,
    error: err
});

gamesRouter.route('/')
    .get(async (req, res) => {
        try {
            const games = await Game.find().lean();

            res.json(generateAnswer(true, games));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    })
    .delete(async (req, res) => {
        try {
            await Game.deleteOne({ chat_id: req.body.chat_id });
            await Room.updateOne({ chat_id: req.body.chat_id }, { $set: { in_game: false } })

            res.json(generateAnswer(true));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    });

gamesRouter.route('/hint')
    .get(async (req, res) => {
        try {
            const game = await Game.findOne({ chat_id: req.query.chat_id });

            res.json(generateAnswer(true, { hint_word: game.hint_word, hint_count:  room.hint_count }));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    })
    .post(async (req, res) => {
        try {
            await Game.updateOne(
                { chat_id: req.body.chat_id },
                { $set: 
                    {
                        hint_word: req.body.hint_word,
                        hint_count: req.body.hint_count
                    }
                }
            );

            res.json(generateAnswer(true));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    });

module.exports = gamesRouter;

