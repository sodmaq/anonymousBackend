const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./index");

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`listening to server on port ${PORT}`);
});
