// routes/chatRoutes.js

const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { chatUpload } = require('../middleware/upload');
const { getChatMessages, uploadChatAttachment } = require("../controllers/chatController");

router.get("/messages/:roomId", protect, getChatMessages);

router.post(
	"/messages/upload",
	protect,
	chatUpload.single('file'),
	uploadChatAttachment
);

module.exports = router;
