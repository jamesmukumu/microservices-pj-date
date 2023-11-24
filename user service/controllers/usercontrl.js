const User = require("../schemas/usersschema")
const crypto = require('crypto')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


//generate random hex
function generateHex(){

const hex = crypto.randomBytes(32).toString("hex")
console.log(hex)

return hex
}


const recevorypass = generateHex()




//register a user
async function Registeruser(req,res){
   
try {
    const hashedPassword = await bcrypt.hash(req.body.password,10)
const insertedUser = new User({
firstname:req.body.firstname,
secondname:req.body.secondname,
username:req.body.username,
password:hashedPassword,
recoveryPassword:recevorypass,
Email:req.body.Email

})
 
await insertedUser.save()
const token = jwt.sign({insertedUser},process.env.jwtpassword,{expiresIn:"1h"})
    return res.status(200).setHeader("Authorization",token).json({message:"user saved sucessfully"})
} catch (error) {
    
if(error.code==1000){
return res.status(500).json({error:"username already exists"})
    }
    else{
        return res.status(500).json({error:`${error}`})
    }
}}











// login user
async function loginUser(req,res){
try {
const foundUser = await User.findOne({username:req.body.username})
if(!foundUser){
return res.status(200).json({message:"User does not have account"})
}
const matchingPassword = await bcrypt.compare(req.body.password,foundUser.password[0])
if(!matchingPassword){
return res.status(200).json({message:"invalid password"})
}
else if(matchingPassword){
const token = jwt.sign({foundUser},process.env.jwtpassword,{expiresIn:"1h"})
return res.status(200).setHeader("Authorization",token).json({message:"Valid credentials"})
}
    
} catch (error) {
    return res.status(500).json({error:`${error}`})
}
}















async function changePassword(req,res){
try {
const hashedPassword = await bcrypt.hash(req.body.password,10)
const passwordtochange = await User.findOneAndUpdate({Email:req.query.Email},{password:hashedPassword})
if(!passwordtochange){
return res.status(200).json({error:"Email not found"})
}

else{

    return res.status(200).json({message:"password changed"})
}
    
} catch (error) {
   return res.status(500).json({error:`${error}`}) 
}



}











module.exports = {Registeruser,loginUser,changePassword}