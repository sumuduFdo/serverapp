const express =  require('express');
const userController = require('../controllers/accountcontroller');
const router = express.Router();
const validator = require('express-validator');
const authorize = require('../middleware/auth')
//const emailvalidator = require('node-email-validation');

router.get('/users', userController.getUsers);

//router.use(authorize);

router.post('/users/login', userController.loginUser);

router.post('/users/register', [
        validator.check('firstname').not().isEmpty(),
        validator.check('lastname').not().isEmpty(),
        validator.check('email').normalizeEmail().isEmail(),
        validator.check('password').isLength({min: 8}),
        validator.check('telephone').not().isEmpty()
    ],
    userController.registerUser);

router.delete('/users/remove', userController.deleteUser);
//export the routes
module.exports = router;