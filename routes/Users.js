const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const { sign } = require("jsonwebtoken");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/", async (req, res) => {
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
});

router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

router.get("/byId/:id", async(req, res) => {
    const id = req.params.id;
    const user = await Users.findByPk(id);
    res.json(user);
});

router.post("/userByUsername", async (req, res) => {
    const username = req.body.username;
    const user = await Users.findOne({ where: { username: username } });
    if (user) {
        res.json(user);
    } else {
        res.json({ error: "User has not been found"});
    }
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    let user = await Users.findOne({ where: { email: email } });
    if (user) {
        res.json({ error: "Account with this e-mail already exists!"});
    }  else {
        user = await Users.findOne({ where: { username: username } });
        if (user) {
            res.json({ error: "This username is already taken"});
        }  else {
            bcrypt.hash(password, 10).then((hash) => {
                Users.create({
                    username: username,
                    email: email,
                    password: hash,
                });
                res.json("registered successfully");
            });
        }
    }
});

router.post("/login", async (req, res) => {
    const { nameOrEmail, password } = req.body;
    let user = await Users.findOne({ where: { username: nameOrEmail } });
    if (!user) {
        user = await Users.findOne({ where: { email: nameOrEmail } });
        if (!user) res.json({ error: "User doesn't exist!"});
    } else {
        bcrypt.compare(password, user.password).then((equal) => {
            if (!equal) {
                res.json({ error: "Wrong password or email/username" });
            } else{
                const accessToken = sign({ username: user.username, id: user.id }, "authsecret");
                res.json(accessToken);
            }
        });
    }
});

module.exports = router;