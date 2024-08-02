const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const middleware = require("../middlewares/authMiddleware");

router.post("/signup", authController.signUP);
router.post("/login", authController.login);
router.post(
  "/handleRefreshToken",
  middleware.refreshTokenMiddleware,
  authController.handleRefreshToken
);
router.get("/getUser", middleware.protected, authController.getUser);
module.exports = router;
