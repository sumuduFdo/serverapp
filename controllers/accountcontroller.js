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
const mailverifier = require('email-verifier');

const httpErr = require('../models/httpErr');
const userModel = require('../models/user');
const verifier = new mailverifier('at_T9vDzzLM3Mw3hpNAblQHbcA35h6NC');


//retrieve all the users from the database
const getUsers = async (req, res, next) => {
    let appusers;
    try{
        appusers = await userModel.find({}, 'firstname lastname email telephone date');
    }
    catch (err){
        console.log(err);
        return next(new httpErr('Failed to get users, please try again'));
    }
    let obj = appusers.stringify
    res.json({appusers: appusers.map( user => user.toObject({getters:true}))});
};

const findUser = async (req, res, next) => {
    const {email, password} = req.body;

    var containuser;
    try{
        containuser = await userModel.findOne({email: email});
    }
    catch (err) {
        console.log(err);
        return next(new httpErr('Could not find user, please try again', 500));
    }

    
    if(!containuser){
            return next(new httpErr('Invalid user credentials. Could not find user.', 401));
    }

   
    console.log("User found on the database")
    res.status(201).json({userid: containuser.userid, firstname: containuser.firstname, lastname: containuser.lastname, telphone: containuser.telephone, email: containuser.email, date: containuser.date});
    
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

/*
    verifier.verify(email, { hardRefresh: true }, (err, data) => {
        if (err) {
            throw (new httpErr('User registration failed, please try again later'), 500);
            console.log(err);
        };
        const {formatCheck, smtpCheck, dnsCheck, freeCheck}} = data;
        const format = data.formatCheck;
        const smtp = data.smtpCheck;
        const dns = data.dnsCheck;
        const free = data.freeChech;
        if(format==false){

        }
        if(smtp==false){

        }
        if(dns==false){

        }

    });
*/
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
    res.status(201).json({userid: newUser.userid, email: newUser.email, firstname: newUser.firstname, lastname: newUser.lastname});
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
   
    console.log("login successful")
    res.status(201).json({userid: containuser.userid, email: containuser.email});
    
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

    try{
        await userModel.deleteOne({email: email}, (err, result, next) => {
            if(err){
                res.send(err)
            }
            else{
                console.log("user deletion successful")
                res.status(201).json({userid: containuser.userid, email: containuser.email});
            }
        });
    }
    catch(err){
        return next(new httpErr('User deletion failed, please try again later', 401));
    }
    console.log("Deletion successful");
    
};

const modifyUser = async (req, res, next) => {
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const telephone = req.body.telephone;
    let modfirstname, modlastname, modtelephone;
    const usergiven = req.body.user;

    if(firstname == null || firstname == ''){
        modfirstname = req.body.user.firstname;
    }
    else{
        modfirstname = firstname;
    }

    if(lastname == null || lastname == ''){
        modlastname = req.body.user.lastname;
    }
    else{
        modlastname = lastname;
    }

    if(telephone == null || telephone == ''){
        modtelephone =req.body.user.telephone;
    } 
    else{
        modtelephone = telephone;
    }
        
    var containuser;
    try{
        containuser = await userModel.findOne({email: req.body.email});
    }
    catch (err) {
        console.log(err);
        return next(new httpErr('User modification failed, please try again', 500));
    }

    if(!containuser){
        return next(new httpErr('Invalid user credentials. Could not find user.', 401));
    }
    
    try{
        await userModel.findOneAndUpdate({email: email }, {firstname: modfirstname, lastname: modlastname, telephone: modtelephone}, {upsert: true, useFindAndModify: true}, function(err, doc) {
            if (err) {
                return next(new httpErr('Could not modify user, please try again later', 500));
            }
            return res.send('Succesfully saved.');
        });
    }
    catch(err){
        return next(new httpErr('Could not modify user, please try again later', 500));
    }
 
    console.log("User modification success");
    
};

//export functions
exports.getUsers = getUsers;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.deleteUser = deleteUser;
exports.modifyUser = modifyUser;
exports.findUser = findUser;

