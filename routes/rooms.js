const { Router } = require('express');
const Room = require('../models/Room');
const Game = require('../models/Game');
const { generateTeams, fakeGenerateTeams, fakeSetRoomPlayers } = require('../utils');

const roomRouter = new Router();

const generateAnswer = (success = false, res = null, err = null) => ({
    success,
    result: res,
    error: err
});

roomRouter.route('/')
    .get(async (req, res) => {
        try {
            const rooms = await Room.find().lean();

            res.json(generateAnswer(true, rooms));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    })
    .post(async (req, res) => {
        try {
            const isRoomExist = await Room.countDocuments({ chat_id: req.body.chat_id });

            if (isRoomExist) {
                res.json(generateAnswer(false, undefined, { mesage: 'Room already exists' }));

                return;
            }

            // TODO remove fake players
            const room =  await Room.create({
                chat_id: req.body.chat_id,
                players: fakeSetRoomPlayers()
            });

            res.json(generateAnswer(true, room));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    })
    .delete(async (req, res) => {
        try {
            const room = await Room.findOne({ chat_id: req.body.chat_id});

            if (room.in_game) {
                await Game.deleteOne({ chat_id: req.body.chat_id });
            }

            await Room.deleteOne({ chat_id: req.body.chat_id });

            res.json(generateAnswer(true));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    });

roomRouter.route('/players')
    .get(async (req, res) => {
        try {
            const room = await Room.findOne({ chat_id: req.query.chat_id });

            res.json(generateAnswer(true, { players: room.players, count:  room.players.length }));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    });

roomRouter.route('/join')
    .post(async (req, res) => {
        try {
            const room = await Room.findOne({ chat_id: req.body.chat_id });
            const playersIds = room.players.map(player => player.user_id);

            if (room.in_game) {
                res.json(generateAnswer(false, undefined, { message: 'Game already started' }));

                return;
            }

            if (playersIds.includes(req.body.user.user_id)) {
                res.json(generateAnswer(false, undefined, { message: 'Player already joined' }));

                return;
            }

            await Room.updateOne(
                { chat_id: req.body.chat_id },
                { $push: { players: req.body.user }}
            );
            
            res.json(generateAnswer(true));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }));
        }
    });

roomRouter.route('/play')
    .post(async (req, res) => {
        try {
            const room = await Room.findOne({ chat_id: req.body.chat_id });

            if (room.players.length < 4) {
                res.json(generateAnswer(false, undefined, { message: 'Not enough players' }));

                return;
            }

            if (room.in_game) {
                res.json(generateAnswer(false, undefined, { message: 'Game already started' }));

                return;
            }

            // TODO uncomment
            // const { captain_blue, captain_red, team_blue, team_red } = generateTeams(room.players);
            const { captain_red, captain_blue, team_blue, team_red } = fakeGenerateTeams();

            room.in_game = true;

            await room.save();

            const game = await Game.create({
                chat_id: req.body.chat_id,
                captain_blue,
                captain_red,
                team_blue,
                team_red
            });

            res.json(generateAnswer(true, game));
        } catch (e) {
            res.json(generateAnswer(false, undefined, { message: e.message }))
        }
    });

module.exports = roomRouter;
