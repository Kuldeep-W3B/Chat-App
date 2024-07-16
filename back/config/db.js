const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Chatapp')
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));
