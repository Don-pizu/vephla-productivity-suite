// util/chatSocket.js

const Chat = require('../models/chat');
const redis = require("../config/redis");

module.exports = function initChat(io) {
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // join room
    socket.on("joinRoom", async ({ userId, roomId }) => {
      if (!userId || !roomId) 
        return;

      socket.join(roomId);

      await redis.sadd("chat:users", userId);
      await redis.sadd(`chat:room:${roomId}:users`, userId);

      io.to(roomId).emit("system", `${userId} joined`);
      emitRoomUsers(roomId);
      emitTotalUsers();
    });

    //Send message in room
    socket.on("sendMessage", async ({ roomId, sender, message, attachment }) => {
      if (!roomId || !sender) 
        return;

      const msg = await Chat.create({
        roomId,
        sender,
        message,
        attachment
      });

      // Cache last 50 messages
      const cacheKey = `chat:room:${roomId}:msgs`;
      const cached = await redis.get(cacheKey);
      const msgs = cached ? JSON.parse(cached) : [];

      msgs.push(msg);
      if (msgs.length > 50) 
        msgs.shift();

      await redis.setex(cacheKey, 300, JSON.stringify(msgs));

      io.to(roomId).emit("newMessage", msg);
    });

    // TYPING INDICATOR
    socket.on("typing", ({ roomId, user }) => {
      socket.to(roomId).emit("typing", user);
    });

    // DISCONNECT
    socket.on("disconnect", async () => {
      emitTotalUsers();
    });

    // HELPERS
    async function emitRoomUsers(roomId) {
      const users = await redis.smembers(`chat:room:${roomId}:users`);
      io.to(roomId).emit("roomUsers", {
        users,
        count: users.length
      });
    }

    async function emitTotalUsers() {
      const count = await redis.scard("chat:users");
      io.emit("totalUsers", count);
    }
  });
};
