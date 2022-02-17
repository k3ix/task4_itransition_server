const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const db = require("./models");

const usersRouter = require("./routes/Users");
const messagesRouter = require("./routes/Messages");
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

db.sequelize.sync().then(() => {
    server.listen(3001, () => {
        console.log("Server runs on port 3001");
    });

    io.on("connection", socket => {
        socket.on("sendMessage", (data) => {
            socket.broadcast.emit("emitSendMessage", data);
        });

        socket.on("disconnect", () => {
            console.log("User " + socket.id + " disconnected")
        });
    });
});
