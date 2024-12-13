
const mongoose = require('mongoose');
const config = require('./config'); 
const connectDB = async () => {
  try {
    await mongoose.connect(`${config.MONGO_URI}/library-system`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
