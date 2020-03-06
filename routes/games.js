const { Router } = require('express');
const Game = require('../models/Game');
const { generateField } = require('../utils');
const gameRouter = require('./game');

const gamesRouter = new Router();

// TODO Переделать роутинг, выделить роуты к конкретной игре
gamesRouter.route('/games')
    .get(async(req, res, next) => {
        try {
            res
                .status(200)
                .json(await Game.find());
        } catch(e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {
        try {
            res
                .status(200)
                .json(await Game.create({ words: generateField() }));

        } catch(e) {
            next(e);
        }
    });

gamesRouter.use('/games/:id', async (req, res, next) => {
    req.game = await Game.findById(req.params.id);

    next();
}, gameRouter);

module.exports = gamesRouter;

