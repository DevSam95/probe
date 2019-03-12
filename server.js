// Require all modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// initialize our express app
const app = express();

// define env
let port = process.env.port || 1234;
let mongoURL = process.env.mongo_URI  || 'mongodb://localhost:27017/probe';

// Import routes
const documents = require('./src/service/routes');

// Database connection
mongoose.connect(mongoURL, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error:'));

// Register modules within app
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(cors({
  origin: 'http://localhost:8080'
}));

// define controllers
app.use('/docs', documents);

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
