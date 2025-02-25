const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/authMiddleware");
const messageController = require("../Controller/messageController");

router.post(
  "/sendMessage/:recipientLink",
  //   middleware.protecte,
  messageController.sendMessage
);

router.get("/getMessages", middleware.protected, messageController.getMessages);
router.delete(
  "/deleteMessage/:messageId",
  middleware.protected,
  messageController.deleteMessage
);

module.exports = router;
