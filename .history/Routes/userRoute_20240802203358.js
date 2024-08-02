const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");

router.post("/signup", authController.signUP);
router.post("/login", authController.login);
router.post("/handleRefreshToken", authController.handleRefreshToken);
module.exports = router;
