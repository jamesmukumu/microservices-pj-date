const User = require("../schemas/usersschema")
const crypto = require('crypto')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const amqp = require("amqplib")
const nodemailer = require("nodemailer")

var channel
var connection


var connectionmscommunication
var channelCommunicationms


var channelfortoken
var connectionfortoken




const transpoter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.usernamegmail,
        pass:process.env.passwordgmail
    }
})






async function sendTokentoms(){


try {
connectionfortoken = await amqp.connect("amqp://localhost:5672")
channelfortoken = await connectionfortoken.createChannel()
channelfortoken.assertQueue("token")

    
} catch (error) {
 console.log(error)   
}



}









//function for sending username to communicationMicroservice
 async function sendUsernametocommunicatiosms(){
try {
  const rabbitServer = "amqp://localhost:5672"
   connectionmscommunication = await amqp.connect(rabbitServer)
   channelCommunicationms = await connectionmscommunication.createChannel()
   await channelCommunicationms.assertQueue("sendUsername")
    
} catch (error) {
    console.log(error)
}

}












//function to connect to amqp
async function makeChannelconnection(){
try {
    let rabbitServer = "amqp://localhost:5672"
    connection = await amqp.connect(rabbitServer)
    channel = await connection.createChannel()
    await channel.assertQueue('phoneNumber')
    
} catch (error) {
    console.log(error)
}
}













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
password:hashedPassword,
recoveryPassword:recevorypass,
Email:req.body.Email,
phoneNumber:req.body.phoneNumber

})
 const mailOptions = {
    to:req.body.Email,
    from:process.env.usernamegmail,
    subject:"Thanks for sign up",
    html:'<p>thankyou</p>'
 }
await insertedUser.save()
await transpoter.sendMail(mailOptions)
const token = jwt.sign({insertedUser},process.env.jwtpassword,{expiresIn:"1h"})
    return res.status(200).setHeader("Authorization",token).json({message:"user saved sucessfully"})
} catch (error) {
    
if(error.code==11000){
return res.status(500).json({error:"username already exists"})
    }
    else{
        return res.status(500).json({error:`${error}`})
    }
}}









  
 
// login user
async function loginUser(req,res){
try { 
    await sendTokentoms()
 await makeChannelconnection()
 await sendUsernametocommunicatiosms()
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

    const cont = await channel.sendToQueue("profileNumber",Buffer.from(JSON.stringify(foundUser.phoneNumber)))
    // console.log(cont)
    await channel.close
    await connection.close


const usernamesent = await channelCommunicationms.sendToQueue("sendUsername",Buffer.from(JSON.stringify(foundUser.username)))
// console.log(usernamesent)
await channelCommunicationms.close 
await connectionmscommunication.close




const tokenSent = await channelfortoken.sendToQueue("token",Buffer.from(JSON.stringify(token)))
console.log(tokenSent)
await channelfortoken.close
await connectionfortoken.close

 return res.status(200).setHeader("Authorization",token).json({message:"Valid credentials",data:foundUser.phoneNumber})
  }
  
    
} catch (error) {
    return res.status(500).json({error:`${error}`})
}
}






//login with recovery password


async function loginwithRecoveryPassword(req,res){
    const accountLoggedin = await User.findOne({recoveryPassword:req.body.recoveryPassword})
try {
  
   if(!accountLoggedin){
  return res.status(200).json({message:"wrong credentials"})
   }
   
 

   else{
   return res.status(200).json({message:"Recovery password matches"})
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

















//function validate Email and send password
async function validateEmailandgetrecoveryPass(req,res){
try{
const validatedEmail = await User.findOne({Email:req.body.Email})
if(!validatedEmail){
return res.status(200).json({message:"Email is non existent"})
}
else{
const token = jwt.sign({validatedEmail},process.env.jwtpassword,{expiresIn:"500s"})
const mailOptions = {
to:req.body.Email,
from:process.env.usernamegmail,
subject:"Recovery Password",
html:`<p style="color:red;">${validatedEmail.recoveryPassword}</p>`

}
await transpoter.sendMail(mailOptions)
return res.status(200).setHeader("Authorization",token).json({message:"Recovery password sent"})

}

}
catch(error){
return res.status(500).json({error:`${error}`})
}

 
}
















module.exports = {Registeruser,loginUser,changePassword,loginwithRecoveryPassword,validateEmailandgetrecoveryPass}
