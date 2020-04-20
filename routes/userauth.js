/*const express = require('express');
const app = express();
const router = express.Router();
const httpErr = require('../models/httpErr')

const usermodel = require('../models/user');

//dummy user

const dummy =  [{
    name: "Fernando"
}];

router.get('/user', (req, res, next) => {
    const id = req.params.uid;
    return dummy;
});


/*
app.post("/users", async (req, res) =>{
    try{
        //async function
        
        const salt =  await crypt.genSalt();
        const hashPass =  await crypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashPass);
        const user = {name: req.body.name,
        password: hashPass}
        usersArr.push(user);
        res.status(201).send("process successful");

        console.log(status)
    }
    catch{
        res.status(500).send("Error, could not perform operation");
    }    
});


module.exports = router;
*/

////////////////////////////////////////////////////////////////
const express =  require('express');
const userController = require('../controllers/accountcontroller');
const router = express.Router();

router.get('/users', userController.getUsers);
router.post('/users/login', userController.loginUser);
router.post('/users/register', userController.registerUser);

//export the routes
module.exports = router;