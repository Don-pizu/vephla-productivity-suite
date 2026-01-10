// server.js 

const app = require ('./app');
const PORT = process.env.PORT || 5000;
const http = require('http');
const initChat = require ('./util/chat');


// Create one HTTP server for both Express & Socket.io
const server = http.createServer(app);

//Initiate socket.io
initChat(server);

server.listen(PORT, () => {
	console.log(`Express Server + Socket.io running on port ${PORT} `);
});