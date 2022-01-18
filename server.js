const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.URl;
console.log(DB);

mongoose
  .connect(process.env.URL)
  .then(() => console.log("connected to MOngodb"))
  .catch((err) => console.error("ITs an error from the database"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
