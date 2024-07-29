const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");

router.post("/signup", authController.signUP);
router.post("/login", authController.signUP);
module.exports = router;
