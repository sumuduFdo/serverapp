const express =  require('express');
const userController = require('../controllers/accountcontroller');
const router = express.Router();
const validator = require('express-validator');
//const emailvalidator = require('node-email-validation');

router.get('/', userController.getUsers);

router.post('/login', userController.loginUser);

router.post('/register', [
        validator.check('firstname').not().isEmpty(),
        validator.check('lastname').not().isEmpty(),
        validator.check('email').normalizeEmail().isEmail(),
        validator.check('password').isLength({min: 8}),
        validator.check('telephone').not().isEmpty()
    ],
    userController.registerUser);

router.delete('/remove', userController.deleteUser);

router.post('/modify', userController.modifyUser);
//export the routes
module.exports = router;