const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const checkJwt = require('../middleware/checkJwt');
const Review = require('../models/reviewModel');
// Register a new user
router.post('/register',checkJwt, async (req, res) => {
  
  const usersub = req.auth.sub;
  const email = req.auth.email;
  const name = req.auth.name;
  const { country, state, message, mobileno, pincode, isprofile = true, issubscribed = false } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });


    // Create a new user instance
    const newUser = new User({
      usersub, email, name, country, state, message, mobileno, pincode, isprofile, issubscribed
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Failed to register user:', error);
    res.status(500).json({ message: 'An error occurred while registering user' });
  }
});

// Get user details
router.get('/showuser',checkJwt, async (req, res) => {
  try {
    const userId = req.auth.sub;

    // Find the user by ID
    const user = await User.findOne({usersub : userId},{usersub:0});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to retrieve user info:', error);
    res.status(500).json({ message: 'An error occurred while retrieving user info' });
  }
});

//check user exits

router.get('/check', checkJwt,async (req, res) => {
    try {
      const userId = req.auth.sub;
  
  
      // Find the user by ID
      const user = await User.findOne({usersub : userId},{usersub:0});
  
      if (user) {
        res.status(200).json({ exists: true });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



  router.get('/no',async (req, res) => {
   res.status(200).json({nice:"nice"})
  });


  router.get('/checksubscription', checkJwt,async (req, res) => {
    try {
      const userId = req.auth.sub;
  
  
      // Find the user by ID
      const user = await User.findOne({usersub : userId},{usersub:0});
  
      if (user.issubscribed == true ) {
        res.status(200).json({ exists: true });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.post('/sendreview', (req, res) => {
    const { name, rating, feedback } = req.body;
  
    // Find the highest reviewId to determine the next reviewId value
    Review.findOne({}, {}, { sort: { 'reviewId': -1 } })
      .then((lastReview) => {
        const reviewId = lastReview ? lastReview.reviewId + 1 : 1;
  
        const review = new Review({ reviewId, name, rating, feedback });
  
        review.save()
          .then(() => {
            res.status(201).json({ message: 'Review saved successfully' });
          })
          .catch((error) => {
            console.log('Error saving review:', error);
            res.status(500).json({ message: 'Error saving review' });
          });
      })
      .catch((error) => {
        console.log('Error finding last review:', error);
        res.status(500).json({ message: 'Error finding last review' });
      });
  });


  router.get('/latestreviews', (req, res) => {
    Review.find({ approved: true })
      .sort({ _id: -1 })
      .limit(4)
      .then((reviews) => {
        res.status(200).json(reviews);
      })
      .catch((error) => {
        console.log('Error retrieving latest reviews:', error);
        res.status(500).json({ message: 'Error retrieving latest reviews' });
      });
  });

  router.get('/allreviews', async (req, res) => {
    try {
      const reviews = await Review.find({ approved: true }).sort({ _id: -1 }).exec();
      res.json(reviews);
    } catch (error) {
      console.error('Error retrieving reviews:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  





module.exports = router;
