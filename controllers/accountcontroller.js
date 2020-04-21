/*
functions to be implemented
    delete uesr
    modify user
*/

//import required modules
const jwtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 }= require('uuid');
const validator = require('express-validator');

const httpErr = require('../models/httpErr');
const userModel = require('../models/user');


//retrieve all the users from the database
const getUsers = async (req, res, next) => {
    let appusers;
    try{
        appusers = await userModel.find({}, 'firstname lastname email');
    }
    catch (err){
        console.log(err);
        return next(new httpErr('Failed to get users, please try again'));
    }

    res.json({appusers: appusers.map( user => user.toObject({getters:true}))});
};


//register a user
const registerUser = async (req, res, next) => {

    const errState = validator.validationResult(req);
    if(!errState.isEmpty()){
        return next(new httpErr('Invalid inputs provided, please re-check your data'));
    }

    const {firstname, lastname, email, telephone} = req.body;
    var found;
    try{
        found= await userModel.findOne({email: email});
    }
    catch (err) {
        console.log(err);
        return next(new httpErr('Signup failed, Please try again', 500));
    }

    if(found){
        return next(new httpErr("Email already exists. Please Log in"));
    }

    let salt;
    let hashPass;
    salt = await bcrypt.genSalt(10);
    try{
        hashPass = await bcrypt.hash(req.body.password, salt);
    }
    catch(err) {
        console.log(err);
        return next(new httpErr('User regsitration failed . Please try again later', 500));
    }
    
    const uniqueId = uuidv4();
    const newUser = new userModel ({
        userid: uniqueId,
        firstname,
        lastname,
        email,
        password: hashPass,
        telephone,
        date: new Date()
    });

    try{
        await newUser.save();
    
    }
    catch(err) {
        console.log(err);
        return next(new httpErr('User registration failed. Please try again later', 500));
    }

/*
    let usertoken;
    try{
        usertoken = webtoken.sign({usrid: newUser.userid, email: newUser.email }, 'confidential', {expiresIn: '2h'});
    }
    catch(err){
        return next(new httpErr('User registration failed. Please try again later', 500));
    }
*/

    res.status(201).json({userid: newUser.userid, email: newUser.email, firstname: newUser.firstname, lastname: newUser.lastname/*, token: usertoken*/});
};


//user sign-in
const loginUser = async (req, res, next) => {
    const {email, password} = req.body;

    var containuser;
    try{
        containuser = await userModel.findOne({email: email});
    }
    catch (err) {
        console.log(err);
        return next(new httpErr('Login failed, Please try again', 500));
    }

    
    if(!containuser){
            return next(new httpErr('Invalid user credentials. Could not find user.', 401));
    }

    let passwordstate = false;
    try{
        passwordstate = await bcrypt.compare(req.body.password, containuser.password);
    }
    catch(err){
        console.log(err);
        return next(new httpErr('User login failed. Please check your password and try again later'), 500);
    }
    
    if(!passwordstate ){
       return next(new httpErr('Invalid password, user login failed', 401));
    }
    
/*    
    let usertoken;
    try{
        usertoken = webtoken.sign({usrid: containuser.userid, email: containuser.email }, 'confidential', {expiresIn: '2h'});
    }
    catch(err){
        return next(new httpErr('User login failed. Please try again later', 500));
    }
*/    
    console.log("login successful")
    res.status(201).json({userid: containuser.userid, email: containuser.email/*, token: usertoken*/});
    
};


//delete a user
const deleteUser = async (req, res, next) => {

    const {email, password} = req.body;

    var containuser;
    try{
        containuser = await userModel.findOne({email: email});
    }
    catch (err) {
        console.log(err);
        return next(new httpErr('Could not find user, Please try again', 500));
    }

    
    if(!containuser){
            return next(new httpErr('Invalid user credentials. Could not find user.', 401));
    }

    let passwordstate = false;
    try{
        passwordstate = await bcrypt.compare(req.body.password, containuser.password);
    }
    catch(err){
        console.log(err);
        return next(new httpErr('User deletion failed. Please check your password and try again later'), 500);
    }
    
    if(!passwordstate ){
       return next(new httpErr('Invalid password, could not delete user', 401));
    }

    userModel.deleteOne({email: email}, (err, result, next) => {
        if(err){
            res.send(err)
        }
        else{
            console.log("user deletion successful")
            res.status(201).json({userid: containuser.userid, email: containuser.email});
        }
    });
    

};

//export functions
exports.getUsers = getUsers;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.deleteUser = deleteUser;

