require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT missing");
}

const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // later restrict domain
    methods: ["GET", "POST"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("joinFlight", (flightId) => {
    socket.join(flightId);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});