//user schema
const mongoose = require('mongoose');

//plugin for unique validation
const validator = require('mongoose-unique-validator');

//user schema
const userSchema = mongoose.Schema({
    userid: {type:String, required:true, unique:true},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true, minlength:8},
    telephone: {type:String, required:true, unique:true},
    date: {type:String, required:true}
});

//apply the plugin for unique-validation
userSchema.plugin(validator);

module.exports = mongoose.model('user', userSchema);