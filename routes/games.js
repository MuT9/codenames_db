const { Router } = require('express');
const Game = require('../models/Game');
const generateField = require('../generateField');
const gameRouter = require('./game');

const gamesRouter = new Router();

// TODO Так роутинг не работает
gamesRouter.route('/games', gameRouter)
    .get(async(req, res, next) => {
        try {
            const games = await Game.find();

            res.status(200);
            res.json(games);
        } catch(e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {
        try {
            const words = generateField();
            const game = await Game.create({ words });

            res.status(200);
            res.json(game);

        } catch(e) {
            next(e);
        }
    });

module.exports = gamesRouter;

