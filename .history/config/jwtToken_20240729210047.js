const jwt = require("jsonwebtoken");

function (id){
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}