const mongoose = require('mongoose')

const usersSchema =  new mongoose.Schema({
firstname:{
    type:String,
    required:true
},
secondname:{
    type:String,
    required:true
},
username:{
    type:[String,Number],
    required:true,
    unique:true
},
password:{
type:[String,Number],
required:true,
unique:true
},
Email:{
    type:[String,Number],
    required:true,
    unique:true
},

recoveryPassword:{
    type:[String,Number],
    required:false,
    unique:true
}})

const User = mongoose.model("User",usersSchema)
module.exports = User