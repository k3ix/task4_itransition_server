const {verify} = require('jsonwebtoken');
const { Users } = require('../models');

const validateToken = async (req, res, next) => {
    const accessToken = req.header("accessToken");
    if (!accessToken) return res.json({error: "User not logged in"})

    try {
        const validToken = verify(accessToken, "authsecret");
        const user = await Users.findOne({where: { id: validToken.id } });
        if (user) {
            req.user = user;
            return next();
        } else {
            return res.json({ error: "User is not logged in"});
        }
    } catch (err) {
        return res.json({error: err});
    }
}

module.exports = { validateToken };