const jwt = require("jsonwebtoken");

function (id){
    return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'});
}