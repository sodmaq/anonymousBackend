const dotenv = require("dotenv");
const process = require("process");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("unhandled Exception shutting down ");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });

const DB = process.env.dataBase.replace(
  "<PASSWORD>",
  process.env.dataBasePassword
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successflly..."));
const app = require("./index");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening to server on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection shutting down ");
  console.log(err.name, err.message);
  app.close(() => {
    process.exit(1);
  });
});

// HANDLING SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down...");
  server.close(() => {
    console.log("Process Terminated!!!");
  });
});
