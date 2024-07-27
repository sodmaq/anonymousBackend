const express = require("express");

const app = express();

app.get("/", async (req, res) => console.log("hello"));
module.exports = app;
