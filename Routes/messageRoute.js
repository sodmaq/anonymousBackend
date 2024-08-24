const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/authMiddleware");
const messageController = require("../Controller/messageController");

router.post("/sendMessage", messageController.sendMessage);

router.get("/getMessages", middleware.protected, messageController.getMessages);

module.exports = router;
