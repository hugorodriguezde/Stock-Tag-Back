const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Create server
const app = express();

// Connection to database
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.vt8hlie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB'))
.catch(e => console.log('db error', e));

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const validateToken = require('./routes/validate-token');
const admin = require('./routes/admin');

// Route middlewares
app.use('/api/user', authRoutes);
app.use('/api/admin', validateToken, admin);
app.use('/api/products', require('./routes/product')); // Routes for products

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});