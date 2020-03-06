const { Router } = require('express');
const Game = require('../models/Game');

const gameRouter = new Router();

// TODO Проверить на работоспособность
gameRouter.route('/')
    .get((req, res, next) => {
        try {
            res
                .status(200)
                .json(req.game);
        }

        catch(e) {
            next(e);
        }
    })
    .delete(async (req, res, next) => {
        try {
            res
                .status(200)
                .json(await Game.findOneAndDelete(req.params.id));
        } catch(e) {
            next(e);
        }
    });

gameRouter.route('/join')
    .post(playerValidator, async (req, res, next) => {
        try {
            const { playerId, role } = req.body;
            const update = (role === 'teamRed' || role === 'teamBlue')
                ? { $push: { [role]: playerId }}
                : { $set: { [role]: playerId }};

            // TODO проверки заняты ли роли, есть ли уже такой юзер и тд
            res
                .status(200)
                .json(await Game.findOneAndUpdate(
                    { _id: req.game._id },
                    update,
                    { new: true }
                ));
        } catch (e) {
            next(e);
        }
    });

gameRouter.route('/hint')
    .get(async (req, res, next) => {
        try {
            res
                .status(200)
                .json(await req.game.select('hintWord hintCount -_id'));
        } catch (e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {
        try {
            // TODO проверки на валидность
            res
                .status(200)
                .json(await Game.findOneAndUpdate(
                    { _id: req.game._id },
                    { $set: { hintWord: req.body.hintWord, hintCount: req.body.hintCount }},
                    { new: true }
                ));
        } catch (e) {
            next(e);
        }
    });

gameRouter.route('/move')
    .post(async (req, res, next) => {
        try {
            const word = await req.game.makeMove(req.body.word);

            res.status(200);
            res.json(word);
        } catch (e) {
            next(e);
        }
    });

async function gameMiddleware (req, res, next) {
    try {
        req.game = await Game.findById(req.params.id);

        next();
    } catch (e) {
        next(e);
    }
}

async function playerValidator (req, res, next) {
    try {
        const { playerId, role } = req.body;
        const game = await Game.findById(req.params.id);
        const players = game.getAllPlayers();

        if (players.includes(playerId)) {
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

module.exports = gameRouter;