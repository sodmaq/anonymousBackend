const express = require("express");
const userRoute = require("./Routes/userRoute");

const app = express();

app.use("/api/v1/users", userRoute);

module.exports = app;
