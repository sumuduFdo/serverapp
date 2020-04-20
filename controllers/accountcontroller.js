/*
functions to be implemented
    delete uesr
    modify user
*/

const jwtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 }= require('uuid');
const validator = require('express-validator');

const httpErr = require('../models/httpErr');
const userModel = require('../models/user');


const modelUser = [{
    userid: "1234",
    firstname:"Tom",
    lastname:"Cruise",
    email: "tom@mail.com",
    password: "password",
    telephone: "123456",
    date: new Date().toLocaleString()
}];

const getUsers = async (req, res, next) => {
    let appusers;
    try{
        appusers = await userModel.find({}, 'firstname lastname email');
    }
    catch (err){
        return next(new httpErr('Failed to get users, please try again'));
    }

    res.json({appusers: appusers.map( user => user.toObject({getters:true}))});
};


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

const loginUser = async (req, res, next) => {
    const {email, password} = req.body;

    var containuser;
    try{
        containuser = await userModel.findOne({email: email});
    }
    catch (err) {
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

/*
/////MEHTODS FOR USER DELETION AND MODIFICATION
const deleteUser = async (req, res, next) =>{
    const useremail = req.params.email;
    
    let user;
    try{
        user = await userModel.findByEmail(useremail).populate;
    }
    catch(err){
        return next(new httpErr('Error, could not delete user'));
    }

    if(!user){
        return next(new httpErr('User not found', 404));
    }

    try{
        const deleteSess = await mongoose.startSession();
        deleteSess.startTransaction();
        await userModel.remove({session: deleteSess});
        await deleteSess.commitTransaction();
    }
};
*/


exports.getUsers = getUsers;
exports.registerUser = registerUser;
exports.loginUser = loginUser;

