const mongoose = require("mongoose");
const mongURI = "mongodb://localhost:27017/?directConnection=true";

//function to connect to DB and this func will be export here and will call in index.js
const connectTomongo = () => {
  mongoose.connect(mongURI, () => {
    console.log("connecting to mongoDB");
  });
};
mongoose.set("strictQuery", true);
module.exports = connectTomongo;
