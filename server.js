// server.js 

const app = require ('./app');
const PORT = process.env.PORT || 5000;
const http = require('http');
const { Server } = require("socket.io");
const initChat = require ('./util/chatSocket');


// Create one HTTP server for both Express & Socket.io
const server = http.createServer(app);

// Create Socket.io instance
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize socket logic
initChat(io);

server.listen(PORT, () => {
	console.log(`Express Server + Socket.io running on port ${PORT} `);
});