require('dotenv').config();

const app = require('./app');
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
    console.log("User connected");
});

app.set("io", io);

server.listen(5000);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

console.log("DB PASSWORD:", process.env.DB_PASSWORD);