const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { ExpressPeerServer } = require('peer');


const Batch = require('./models/batchModel');

const cors=require("cors");



uri=  'mongodb+srv://nirvanatechsolutions:XzAWqQaiQAAgsacn@encodedbits.npwoljq.mongodb.net/'
const app = express();











const corsOptions ={
   origin:['http://localhost:4200','https://nirvanatechsolutions.github.io/EncodedFrontendtest'], 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

const authRoutes = require('./routes/authRoutes');
const paymentRoutes  = require('./routes/paymentRoutes')
const batchRoutes  = require('./routes/batchRoutes')






 // Use this after the variable declaration

// Create an Express application

app.use(cors(corsOptions))

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:4200','https://encodedbackend.vercel.app/','https://nirvanatechsolutions.github.io/EncodedFrontendtest']; 

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    return res.status(403).send('Unauthorized access');
  }

  next();
});


// Parse incoming JSON requests
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });




  //define the routes of apis
  app.use('/auth', authRoutes);
  app.use('/payment', paymentRoutes);
  app.use('/b', batchRoutes);





    // Start the server
const serverwithsocket =    app.listen(1220, () => {
    console.log('Server is running on port 1220');
    });

    const io = require('socket.io')(serverwithsocket, {
      cors: {
       origin: ["http://localhost:4200","https://encodedbackend.vercel.app/","https://nirvanatechsolutions.github.io/EncodedFrontendtest"], //specific origin you want to give access to,
   }}); //? invoking the func also something like func()
      
    io.on('connection', (socket) => {
      console.log('a user connected',socket.id);
      Batch.watch().on('change', async (change) => {
        if (change.operationType === 'update') {
          const updatedBatchId = change.documentKey._id;
      
          try {
            const updatedBatch = await Batch.findById(updatedBatchId).exec();
            io.emit('batchUpdated', updatedBatch);
          } catch (error) {
            console.error('Failed to fetch updated batch:', error);
          }
        }
      });

        // Handle new room creation
 

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

      
    });

    
    