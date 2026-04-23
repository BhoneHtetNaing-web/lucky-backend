require("dotenv").config();
const app = require("./app");

// ❗ PORT
const PORT = process.env.PORT || 5000;

// ❗ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// require('dotenv').config();

// const app = require('./app');

// const PORT = process.env.PORT || 5000;

// const server = require("http").createServer(app);
// server.listen(5000);

// const io = require("socket.io")(server, {
//     cors: { origin: "*" }
// });

// io.on("connection", (socket) => {
//     console.log("User connected");
// });

// app.set("io", io);

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// })