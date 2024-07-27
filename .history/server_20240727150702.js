const app = require("./index");

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("listening to server on port 3000");
});
