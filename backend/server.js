// grab our dependencies
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    expressLayouts = require('express-ejs-layouts'),
    cookieParser = require('cookie-parser')

// configure our application
require('dotenv').config()

const port = 8080;

// Explicitly set the absolute path for views
const viewsPath = path.resolve(__dirname, '../frontend/public/views/pages');
const layoutPath = path.resolve(__dirname, '../frontend/public/views');
app.set('views', viewsPath);
app.set('view engine', 'ejs');

// Configure express-ejs-layouts
app.use(expressLayouts);
app.set('layout', layoutPath + '/layout.ejs');

// connect to our database
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URI)
    .then(() => {
    })
    .catch((err) => {
        console.error('DB connection error:', err);
        process.exit(1);
    });
// set a global variable for root path
global.root = path.resolve(__dirname);

// use cookie parser for username cookie
app.use(cookieParser());

// use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, '../frontend/public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// import routes
app.use(require('./app/routes'));

// start our server
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

module.exports = app;