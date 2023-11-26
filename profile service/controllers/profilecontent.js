const Profile = require('../schemas/profileschem')
const Furtherdetails = require("../schemas/moredetailsprof")
const Sequelize = require("sequelize")
const amqp = require('amqplib')
var channel
var connection
var phoneNumberfromuserService
//make a connection to the user service to receivePhonenumber when loggin in


async function Connectionwithuserservice(){
  try {
  
      const rabbitServer = "amqp://localhost:5672"
      connection = await amqp.connect(rabbitServer)
      channel = await connection.createChannel() 
      await channel.assertQueue("profileNumber")  
      channel.consume("profileNumber",(data)=>{
       phoneNumberfromuserService = `0${Buffer.from(data.content)}`
       console.log(phoneNumberfromuserService)
     channel.ack(data)
      })  
   
  } catch (error) {
      console.log(error) 
  }  
      
  }
  Connectionwithuserservice();







async function makeProfile(req,res){
try {
const  {Profilename,age,birthDate,Nationality,phoneNumber} = req.body
const createdProfile = new Profile( {Profilename,age,birthDate,Nationality,phoneNumber})
await createdProfile.save() 
return res.status(200).json({message:"Profile created"})
} catch (error) {
  if(error=="SequelizeUniqueConstraintError: Validation error"){
   return res.status(500).json({error:"phonenumber or profile name already exists"})
  }




   return res.status(500).json({error:`${error}`}) 
}
}




  
//see a own profile after loggin in

async function seeProfile(req,res){
try {
const findAccountbyphone = await Profile.findOne({where:{phoneNumber:phoneNumberfromuserService}})
if(!findAccountbyphone){
return res.status(200).json({message:"No account found"})
}
else if(findAccountbyphone){
  const furtherprofileinfo = await Furtherdetails.findOne({where:{phoneNumber:{[Sequelize.Op.eq]:phoneNumberfromuserService}}})
  return res.status(200).json({profile:findAccountbyphone,additionalDetails:furtherprofileinfo})
}
} catch (error) {  
  return res.status(500).json({error:`${error}`})
}
}



























module.exports = {
makeProfile,
seeProfile

}