const mongoose = require('mongoose');
require('dotenv').config();
const uri= process.env.MONGO_URI;
const connectDB= async () => (
    mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas:', err))
)
module.exports= connectDB;