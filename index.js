const express = require("express");
const morgan = require("morgan");
const userRoute = require("./Routes/userRoute");
const messageRoute = require("./Routes/messageRoute");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controller/errorController");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://anonymous-rust.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/messages", messageRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
