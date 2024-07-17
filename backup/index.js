const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();



// Import route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

app.use(cors());
app.use(require("morgan"));
// app.use(express.json());

// Use routes
app.use('/api/users', authRoutes);
app.use('/api/auth/users', userRoutes);
app.use('/api/post',postRoutes);

mongoose.connect('mongodb://localhost:27017/socialnetwork', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
