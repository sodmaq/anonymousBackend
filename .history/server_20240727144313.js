const app = require("./index");

const PORT = 3000;
app.listen(PORT || 8000, () => {
  console.log("listening to server on port 3000");
});
