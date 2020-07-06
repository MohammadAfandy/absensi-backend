const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`Connected to MongoDB on ${con.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDb;
