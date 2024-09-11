const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => console.log("Error connecting to DB", err));
};

module.exports = connectDatabase;
