// app.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Product = require('./product');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Product route
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}, 'name price');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// JWT token generation
function generateToken(userId, secretKey) {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
  return token;
}

// Authenticate middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Token is valid, set the decoded user ID in the request object
    req.userId = decoded.userId;
    next();
  });
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
