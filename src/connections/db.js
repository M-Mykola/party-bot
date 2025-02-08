const mongoose = require('mongoose');

async function mongooseConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = mongooseConnection;
