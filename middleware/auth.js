const webtoken = require('jsonwebtoken');
const httpErr = require('../models/httpErr');

const authorize = (req, res, next) => {
    try{
        const tokenobj = webtoken.verify(webtoken, 'confidential');
        req.data = {userid: tokenobj.userid, email:tokenobj.email};
        next(); //reqest is allowed to continue to next funtion
    }
    catch(err){
        return next(new httpErr('Authentication failed', 401));
    }
};
