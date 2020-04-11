const { Router } = require('express');
const Room = require('../models/Room');

const roomRouter = new Router();

roomRouter.route('/')
    .get(async (req, res) => {
        res.status(200).json(await Room.find().lean());
    })
    .post(async (req, res) => {
        try {
            res.status(200).json(await Room.create({ chat_id: req.body.chat_id }));
        } catch (e) {
            res.json(e);
        }
    })

roomRouter.route('/players')
    .get(async (req, res) => {
        try {
            const room = await Room.findOne({ chat_id: req.query.chat_id });
            res.status(200).json({ players: room.players, count:  room.players.length })
        } catch (e) {
            res.json(e);
        }
    })

roomRouter.route('/join')
    .post(async (req, res) => {
        try {
            const isPlayerAlreadyJoined = await Room.countDocuments({
                chat_id: req.body.chat_id,
                players: { $elemMatch: { user_id: req.body.user_id }}
            });

            if (isPlayerAlreadyJoined) {
                res.json({ status: 'error', message: 'Player already joined' });
            }

            res.status(200).json(await Room.updateOne(
                { chat_id: req.body.chat_id },
                { $push: { players: req.body.user }}
            ));
        } catch (e) {
            res.json(e);
        }
    })

module.exports = roomRouter;
