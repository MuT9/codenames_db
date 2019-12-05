const { Router } = require('express');
const Game = require('../models/Game');
const generateField = require('../generateField');

const gamesRouter = new Router();

gamesRouter.route('/games')
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

gamesRouter.route('/games/:id')
    .get(async (req, res, next) => {
        try {
            const game = await Game.findById(req.params.id);

            res.status(200);
            res.json(game);
        }

        catch(e) {
            next(e);
        }
    })
    .delete(async (req, res, next) => {
        try {
            //TODO поменять, т.к. deprecated
            const game = await Game.findByIdAndRemove(req.params.id);

            res.status(200);
            res.json(game);
        } catch(e) {
            next(e);
        }
    });

gamesRouter.route('/games/:id/join')
    .post(async (req, res, next) => {
        try {
            const game = await Game.findById(req.params.id);
            const role = req.body.role;

            // TODO проверки заняты ли роли, есть ли уже такой юзер и тд
            if (Array.isArray(game[role])) {
                game[role].push(req.body.userId);
            } else {
                game[role] = req.body.userId
            }

            await game.save();

            res.status(200);
            res.json(game);
        } catch (e) {
            next(e);
        }
    });

module.exports = gamesRouter;

