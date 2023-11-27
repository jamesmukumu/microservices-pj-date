const Furtherdetails = require("../schemas/moredetailsprof")


// add more profile details
//
async function Addprofileinfo(req,res){
try {
    
    const {Hobbies,imageMain,image2,image3,image4,RelationshipStatus,Desireandwants,phoneNumber} = req.body
    const inserterdAdditionalprofile = new Furtherdetails({Hobbies,imageMain,image2,image3,image4,RelationshipStatus,Desireandwants,phoneNumber})
    await inserterdAdditionalprofile.save()
     await channel.sendToQueue("communication",Buffer.from(JSON.stringify(inserterdAdditionalprofile)))
     await channel.close()
     await connection.close()

    return res.status(200).json({message:"further profile details inserted sucessfully"})
} catch (error) {
    return res.status(500).json({error:`${error}`})
}} 


















module.exports = Addprofileinfo