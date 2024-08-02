const express = require("express");
const morgan = require("morgan");
const userRoute = require("./Routes/userRoute");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/users", userRoute);

module.exports = app;
