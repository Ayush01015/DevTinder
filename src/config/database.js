const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ayush625:ayush575@cluster0.cfykzkw.mongodb.net/devTinder"
  );
};

module.exports = connectDB;