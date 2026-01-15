//controllers/chatController.js

const Chat = require("../models/chat");
const redis = require("../config/redis");


//GET Get chat messages
exports.getChatMessages = async (req, res) => {
  const { roomId } = req.params;
  const cacheKey = `chat:room:${roomId}:msgs`;

  const cached = await redis.get(cacheKey);
  if (cached) 
    return res.json(JSON.parse(cached));
  

  const messages = await Chat.find({ roomId })
					    .sort({ createdAt: -1 })
					    .limit(50)
					    .populate("sender", "name");

  await redis.setex(cacheKey, 300, JSON.stringify(messages.reverse()));

  res.json(messages);
};


//POST  upload attachments
exports.uploadChatAttachment = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  let type = "file";

  if (req.file.mimetype.startsWith("image")) type = "image";
  else if (req.file.mimetype.startsWith("video")) type = "video";
  else if (req.file.mimetype === "application/pdf") type = "pdf";

  res.status(201).json({
    url: req.file.path,      
    publicId: req.file.filename,
    type
  });
};
