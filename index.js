const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const cors = require('cors');
const app = express();

//capturar body
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexion a base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.vt8hlie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(uri)
.then(() => console.log('Conectado a MongoDB'))
.catch(e => console.log('error db', e));

// import routes
const authRoutes = require('./routes/auth');
const validateToken = require('./routes/validate-token');
const admin = require('./routes/admin');


//route middlewares
app.use('/api/user', authRoutes);
app.use('/api/admin', validateToken, admin);
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});

//iniciar server

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Corriendo en puerto ${PORT}`);
});