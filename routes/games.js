const { Router } = require('express');
const Game = require('../models/Game');
const generateField = require('../generateField');

const gamesRouter = new Router();
const gameRouter = new Router();

gamesRouter.route('/')
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

gameRouter.route('/')
    .get(async (req, res, next) => {
        try {
            const game = await Game.findById(req.params.id);

            res.status(200);
            res.json(req.params);
        }

        catch(e) {
            next(e);
        }
    });

module.exports = {gamesRouter, gameRouter};

