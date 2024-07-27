const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log("unhandled Exception shutting down ");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
const app = require("./index");

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`listening to server on port ${PORT}`);
});
