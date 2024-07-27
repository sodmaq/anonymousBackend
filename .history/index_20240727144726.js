const express = require("express");

const app = express();

app.get("/", hello);
module.exports = app;
