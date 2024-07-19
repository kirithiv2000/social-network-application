const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const setupSwagger = require('./swaggerConfig');

// Import route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

app.use(cors());
// app.use(require("morgan"));
app.use(express.json());

// Use routes
app.use('/api/users', authRoutes);
app.use('/api/auth/users', userRoutes);
app.use('/api/post', postRoutes);

setupSwagger(app);
var dbURI = 'mongodb://localhost:27017/socialnetwork' 
if (process.env.NODE_ENV==="test"){
  dbURI = 'mongodb://localhost:27017/socialnetwork_test' 

}
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>console.log('db connected to ',dbURI))
.catch((error)=>console.log('error',error))

app.get("/testapi", (req, res) => {
  res.send("test api is working");
});

const server = app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


module.exports = { app, server }; // Export both app and server