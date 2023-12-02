const Profile = require('../schemas/profileschem')
const Furtherdetails = require("../schemas/moredetailsprof")
const Sequelize = require("sequelize")
const amqp = require('amqplib')

var channelforphonenumber
var connectionforphonenumber
var phoneNumberfromuserService
//make a connection to the user service to receivePhonenumber when loggin in

 
async function connectionwithUserservice(){
  try {
  
       
      connectionforphonenumber = await amqp.connect("amqp://localhost:5672")
      channelforphonenumber = await connectionforphonenumber.createChannel() 
      await channelforphonenumber.assertQueue("phonenumber")  
     await channelforphonenumber.consume("phonenumber",(data)=>{
       phoneNumberfromuserService = `0${Buffer.from(data.content)}`
       console.log(phoneNumberfromuserService)
     channelforphonenumber.ack(data)
      })   
   
  } catch (error) { 
      console.log(error)  
  }     
      
  }




 



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
await connectionwithUserservice()
const findAccountbyphone = await Profile.findOne({where:{phoneNumber:phoneNumberfromuserService},include:{model:Furtherdetails}})
if(!findAccountbyphone){
return res.status(200).json({message:"No account found"})
}
else{
  
  return res.status(200).json({message:"profile fetched",data:findAccountbyphone})
} 
} catch (error) {  
  return res.status(500).json({error:`${error}`})
} 
}
 
 





// filter on ages


async function filterSearchesonages(req,res){
try {
const lowerAgelimit = req.query.lowerage
const higherAgelimit = req.query.higherage

const profilesFittingagequery = await Profile.findAll({where:{age:{[Sequelize.Op.gte]:lowerAgelimit,[Sequelize.Op.lte]:higherAgelimit}}})
if(profilesFittingagequery.length === 0){
return res.status(200).json({message:"No ages found based on your search"})
}
else if(profilesFittingagequery){
    

  // show further details to
for(let numberphone of profilesFittingagequery){
  const additionalInfo = await Furtherdetails.findAll({where:{phoneNumber:numberphone.phoneNumber}})
  
  return res.status(200).json({profile:profilesFittingagequery,additionaldet:additionalInfo})
}
}
  
} catch (error) {
  return res.status(500).json({error:`${error}`})
}
}







// filter on nationality

async function filterOnnationality(req,res){
try {

const nationalityQuery = req.query.Nationality

const matchingNationalities = await Profile.findAll({where:{Nationality:{[Sequelize.Op.iLike]:`%${nationalityQuery}%`}}})

if(matchingNationalities.length===0){
return res.status(200).json({message:"No results found based on the search"})
}
else if(matchingNationalities){
for(let national of matchingNationalities){
const matchingNationalitiesandaddprofile = await Furtherdetails.findAll({where:{phoneNumber:national.phoneNumber}})
return res.status(200).json({profile:matchingNationalities,addtionals:matchingNationalitiesandaddprofile})
}
}
  
} catch (error) {
  return res.status(500).json({error:`${error}`})
}

}





//fetch matching 

async function fetchMatchingprofiles(req,res){
try{
  await connectionwithUserservice()
  const userProf = await Profile.findOne({where:{phoneNumber:phoneNumberfromuserService}})
  if(!userProf){
 return res.status(200).json({message:"No profile"})
  }

else if(userProf){
const allMatichingprofile = await Profile.findAll({
  where: {
    [Sequelize.Op.or]: [
      {
        Nationality: userProf.Nationality
      },
      {
        age: { [Sequelize.Op.eq]: userProf.age }
      },
      {
        phoneNumber: {
          [Sequelize.Op.ne]: phoneNumberfromuserService
        }
      }
    ]
  },
  include:{model:Furtherdetails}
  
});


return res.status(200).json({message:"Matching profile",data:allMatichingprofile})
}

}
catch(error){

return res.status(500).json({error:`${error}`})
}




}
















module.exports = {
makeProfile,
seeProfile,
filterSearchesonages,
filterOnnationality,
fetchMatchingprofiles

}