const userSchema = require("../Models/userModel");

const signUP = async (req, res) => {
    const { name, email, password } = req.body;