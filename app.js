//import modules
const bodyparser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

//create an express application
const app = express();
app.use(bodyparser.json());

//import defined routes and models
const httpErr = require('./models/httpErr');
const userRoutes = require('./routes/userauth');

app.use('/users', userRoutes);

app.use((req, res, next) => {
    return next(new httpErr("Could not find route", 404)) ;
});

//middleware for error handling
app.use((err, req, res, next) => {
    if(res.headerSend){
        return next(err);
    }
    res.status(err.code || 500);
    res.json({message: err.message || "An unknown error occured"})
})
//middleware to handle invalid routes



const connURI = 'mongodb://localhost:27017/userDB';
mongoose.connect(connURI,{ useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true})
        .then( () => {
            app.listen(4000);
            console.log("Database connection successful")
        })
        .catch( err => {
            console.log(err);
        });