const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/database');

// Mongoose DB connection
mongoose.connect(config.database);

mongoose.connection.on('connected', ()=> {
    console.log('Connected to DB :'+config.database);
});
mongoose.connection.on('error', (err)=>{
    console.log('Database error: '+err);
})

const app = express();

const users = require('./routes/users');

//Port No.
const port = process.env.PORT || 8080;
// CORS Middleware
app.use(cors());

// Set Static Folder
app.use( express.static(path.join( __dirname, 'public' ) ) );

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

// Base Route - any other route entered outside of routes we set will go to 'public/index.html'
app.get('*', (req, res)=>{
    res.sendFile( path.join( __dirname, 'public/index.html' ));
});

// Start Server
app.listen(port, ()=> {
    console.log('Server started at port: '+port);
});