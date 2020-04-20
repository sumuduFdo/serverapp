//user schema
const mongoose = require('mongoose');

//plugin for unique validation
const validator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    userid: {type:String, required:true, unique:true},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    telephone: {type:String, required:true, unique:true},
    date: {type:String, required:true}
});

userSchema.plugin(validator);

module.exports = mongoose.model('user', userSchema);