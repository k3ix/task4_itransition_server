const express = require('express');
const router = express.Router();
const { Messages } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:UserId", async (req, res) => {
    const userId = req.params.UserId;
    const messages = await Messages.findAll({ where: { UserId: userId } });
    res.json(messages);
});

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    const message = await Messages.findByPk(id);
    console.log(message);
    if (!message) {
        res.json({ error: "No message by this id"});
    } else {
        res.json(message);
    }
});

router.post("/write-message", async (req, res) => {
    const {fromUsername, fromUserId, topic, text, forUsername, forUserId} = req.body;
    const message = await Messages.create({
        fromUserId: fromUserId,
        fromUsername: fromUsername,
        topic: topic,
        text: text,
        forUsername: forUsername,
        UserId: forUserId
    });
    res.json(message);
});





module.exports = router;