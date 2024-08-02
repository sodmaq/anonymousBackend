const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const middleware = require("../middlewares/authMiddleware");

router.post("/signup", authController.signUP);
router.post("/login", authController.login);
router.post("/handleRefreshToken", authController.handleRefreshToken);
router.get("/getUser", middleware, authController.getUser);
module.exports = router;
