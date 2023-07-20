const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/checkJwt');

const Batch = require('../models/batchModel')



router.get('/getbatch',checkJwt, async (req, res) => {
  try {
    const studentId = req.auth.sub;

    // Find the batch that contains the provided student ID
    const batch = await Batch.findOne({ studentList: studentId }).exec();

    if (batch) {


      // Return the batch information
      res.json(batch);
    } else {
      // If no batch found, return an error response
      res.status(200).json({ message: 'Batch not found for the provided student ID.' });
    }
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

  
module.exports = router;
