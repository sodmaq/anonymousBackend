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
router.post(
  "/updatePassword",
  middleware.protected,
  authController.updatePassword
);
router.get("/verifyEmail/:token", authController.verifyEmail);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
