const express = require("express");
const userRoute = require("./Routes/userRoute");

const app = express();

app.use("/api/v1.user", userRoute);

module.exports = app;
