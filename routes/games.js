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
    .post(playerValidator, async (req, res, next) => {
        try {
            const game = await Game.findById(req.params.id);

            // TODO проверки заняты ли роли, есть ли уже такой юзер и тд
            await game.addPlayer(req.body.playerId, req.body.role)

            res.status(200);
            res.json(game);
        } catch (e) {
            next(e);
        }
    });

gamesRouter.route('/games/:id/hint')
    .get(async (req, res, next) => {
        try {
            const hint = await Game.findById(req.params.id).select('hintWord hintCount -_id');

            res.status(200);
            res.json(hint);
        } catch (e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {
        try {
            const game = await Game.findById(req.params.id);

            // TODO проверки на валидность
            await game.setHint(req.body.hintWord, req.body.hintCount);

            res.status(200);
            res.json(game);
        } catch (e) {
            next(e);
        }
    });

gamesRouter.route('/games/:id/move')
    .post(async (req, res, next) => {
        try {
            const game = await Game.findById(req.params.id);

            const word = await game.makeMove(req.body.word, req.body.team);

            res.status(200);
            res.json(word);
        } catch (e) {
            next(e);
        }
    });

async function playerValidator (req, res, next) {
    try {
        const { playerId, role } = req.body;
        const game = await Game.findById(req.params.id);
        const players = game.getAllPlayers();

        if (players.includes(req.body.playerId)) {
            // TODO Обработка ошибок
            throw new Error('Player already joined');
        }

        if (!Array.isArray(game[role]) && !!game[role]) {
            throw new Error('Captain already chosen');
        }

        req.game = game;
        next();
    } catch(e) {
        next(e);
    }
};

module.exports = gamesRouter;

