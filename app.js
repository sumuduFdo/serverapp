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
//middleware for error handling
app.use((err, req, res, next) => {
    if(res.headerSend){
        return next(err);
    }
    res.status(err.code || 500);
    res.json({message: err.message || "An unknown error occured"})
})


app.use(userRoutes)
app.listen(4000);