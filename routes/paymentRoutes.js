const express = require('express');
const router = express.Router();
const payment = require('../models/paymentModel');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/userModel');
const checkJwt = require('../middleware/checkJwt');
require('dotenv').config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.razor_id,
  key_secret: process.env.razor_secret
});

// Create an order
router.post('/createOrder', (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Convert amount to paise
    currency: 'INR',
    receipt: 'receipt1',
    payment_capture: 0 // Auto-capture is disabled (0 for false)
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error creating order' });
    }
    res.json(order);
  });
});

// Handle payment success
router.post('/paymentSuccess',checkJwt, async(req, res) => {
    const usersub =  req.auth.sub;
    const name =  req.auth.name;
  const { response, amount, activation, expiration,plan } = req.body;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

  var generatedSignature = crypto
    .createHmac("SHA256", process.env.razor_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    // Signature verification successful
    const newPayment = new payment({
      usersub:usersub,
      name:name,
      amount:amount, // Convert amount from paise to rupees
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      plan: plan,
      activation:activation,
      expiration:expiration
    });

    // Find the user by usersub
    
    // Find the user by usersub
    User.findOneAndUpdate(
      { usersub: req.auth.sub },
      { issubscribed: true },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          console.log('User not found');
          return;
        }
        console.log('Updated user:', updatedUser);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });



        // Modify the user document by adding the payment details to the existing array
        await newPayment.save()



    res.status(200).json({ message: 'Payment success' });
  } else {
    // Signature verification failed
    console.log('Invalid signature');
    res.status(400).json({ error: 'Invalid signature' });
  }
});

router.post('/createOrderUSD', (req, res) => {
    const { amount } = req.body;
  
    const options = {
      amount: amount * 100, // Convert amount to paise
      currency: 'USD',
      receipt: 'receipt1',
      payment_capture: 0 // Auto-capture is disabled (0 for false)
    };
  
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error creating order' });
      }
      res.json(order);
    });
  });

  router.get('/getpayment',checkJwt, async (req, res) => {
    try {
      const studentId = req.auth.sub;
  
      // Find the batch that contains the provided student ID
      const user = await payment.find({ usersub: studentId }).exec();

  
      if (user) {
        // Return the batch information
        res.json(user);
      } else {
        // If no batch found, return an error response
        res.status(404).json({ message: 'Batch not found for the provided student ID.' });
      }
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });



  


module.exports = router;
