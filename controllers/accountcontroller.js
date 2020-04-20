/*
functions to be implemented
    get all users
    add user
    delete uesr
    modify user
*/

const bcrypt = require('bcrypt');
const { v4: uuidv4 }= require('uuid');
const httpErr = require('../models/httpErr');


const modelUser = [{
    userid: "1234",
    firstname:"Tom",
    lastname:"Cruise",
    email: "tom@mail.com",
    password: "password",
    telephone: "123456",
    date: new Date().toLocaleString()
}];

const getUsers = (req, res, next) => {
    res.status(200).send({users: modelUser});
};

const registerUser = (req, res, next) => {
    const {firstname, lastname, email, telephone} = req.body;

    const found = modelUser.find(user => user.email === email);
    if(found){
        res.send("Email already exists. Please sign in");
    }
    const newUser = {
        id: uuidv4(),
        firstname,
        lastname,
        email,
        password: "password",
        telephone,
        date: new Date()
    }

    modelUser.push(newUser);
    res.status(201).send("Success, user created");
};

const loginUser = (req, res, next) => {
    const {email, password} = req.body;

    const loginUsr = modelUser.find( user => user.email === email);
    if(!loginUsr){
        //throw new httpErr('Invalid user credentials. Could not find user.' , 401);
        res.send('Invalid user credentials. Could not find user.')
    }
    if(loginUsr.password !== password){
        //throw new httpErr('Invalid password. User login failed', 401);
        res.send('Invalid password. User login failed');
    }
    res.send("User logged in");
};


exports.getUsers = getUsers;
exports.registerUser = registerUser;
exports.loginUser = loginUser;

/*
const createUser = async (req, res, next) => {
    try{
        //async function
        
        const salt =  await bcrypt.genSalt();
        const hashPass =  await bcrypt.hash(req.body.password, salt);
        var uid = uuidv4();
        Date userDate = new Date();
        console.log(salt);
        console.log(hashPass);
        const user = { 
            userid: uid,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashPass,
            telephone: req.body.telephone,
            date: userDate    
        };
        res.status(201).send("Success");
    }
    catch{
        res.status(500).send("Error, could not perform operation");
    }
};
*/