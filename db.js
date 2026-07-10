 const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.fqtokn3.mongodb.net/krist_shop?retryWrites=true&w=majority`
    );

    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = dbConnection;