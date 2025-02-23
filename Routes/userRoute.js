const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const userController = require("../Controller/userController");
const middleware = require("../middlewares/authMiddleware");

router.post("/signup", authController.signUP);
router.get("/auth/google", authController.googleAuth);
router.get("/auth/google/callback", authController.googleCallback);
router.post("/login", authController.login);
router.post(
  "/handleRefreshToken",
  middleware.refreshTokenMiddleware,
  authController.handleRefreshToken
);
router.patch(
  "/updatePassword",
  middleware.protected,
  authController.updatePassword
);
router.get("/verifyEmail/:token", authController.verifyEmail);
router.post("/resendVerificationEmail", authController.resendVerificationEmail);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get("/me", middleware.protected, userController.getUser);
router.get(
  "/allUsers",
  middleware.protected,
  middleware.isAdmin,
  userController.getAllUsers
);
router.patch("/updateMe/:id", middleware.protected, userController.updateUser);
router.delete("/deleteMe/:id", middleware.protected, userController.deleteMe);
router.delete(
  "/deleteUser/:id",
  middleware.protected,
  middleware.isAdmin,
  userController.deleteUser
);
module.exports = router;
