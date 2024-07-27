const express = require("express");

const app = express();

app.get("/", async (req, res) => console.log("hello")
res.send("hello"));
module.exports = app;
