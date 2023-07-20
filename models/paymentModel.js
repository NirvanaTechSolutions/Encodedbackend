const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
usersub: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
  amount: {
    type: Number,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  payment_id: {
    type: String,
  },
  plan: {
    type: String,
  },
  activation: {
    type: Date,
  },
  expiration: {
    type: Date,
  },
});



const payment = mongoose.model('payment', paymentSchema);

module.exports = payment;
