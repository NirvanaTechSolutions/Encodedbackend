const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  usersub: String,
  email: String,
  name: String,
  country: String,
  state: String,
  message: String,
  mobileno: String,
  pincode: Number,
  isprofile: Boolean,
  issubscribed: Boolean,
  batchId: {
    type: String,
    default: 'unset' // Set default value to an empty string
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
