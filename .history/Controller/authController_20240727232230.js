const userSchema = require("../Models/userModel");


const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        
    }