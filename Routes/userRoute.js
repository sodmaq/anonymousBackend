const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const userController = require("../Controller/userController");
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

router.get("/me", middleware.protected, userController.getUser);
// router.get("/allUsers", middleware.admin, userController.getAllUsers);
router.patch("/updateMe", middleware.protected, userController.updateUser);
router.delete("/deleteMe/:id", middleware.protected, userController.deleteUser);

module.exports = router;
