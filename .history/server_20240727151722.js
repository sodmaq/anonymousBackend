const app = require("./index");
const dotenv = require("dotenv");
require("dotenv").config();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`listening to server on port ${PORT}`);
});
