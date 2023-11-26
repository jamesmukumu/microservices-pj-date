const Profile = require('../schemas/profileschem')





async function createProfile(req,res){
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





























module.exports = createProfile