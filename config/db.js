const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    // Set strictQuery to false (or true based on your preference)
    mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Mongodb Server Issue ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
