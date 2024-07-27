const app = require("./index");

const PORT = process.env.PORT;
app.listen(PORT || 8000, () => {
  console.log("listening to server on port 3000");
});
