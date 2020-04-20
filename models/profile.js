
const bcrypt = require('bcrypt');
const {v4: uuid} = require('uuid');

let userProfile = function(param){
    this.userid = param.userid;
    this.firstname = param.firstname;
    this.lastname = param.lastname;
    this.email = param.email;
    this.telephone = param.telephone;
    this.password = param.password;
    this.date = param.date;
}


module.exports = userProfile;