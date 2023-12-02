const Furtherdetails = require("../schemas/moredetailsprof")


// add more profile details
//
async function Addprofileinfo(req,res){
try {
    
    const {Hobbies,imageMain,image2,image3,image4,RelationshipStatus,Desireandwants,profilestablePhoneNumber} = req.body
    const inserterdAdditionalprofile = new Furtherdetails({Hobbies,imageMain,image2,image3,image4,RelationshipStatus,Desireandwants,profilestablePhoneNumber})
    await inserterdAdditionalprofile.save()
    

    return res.status(200).json({message:"further profile details inserted sucessfully"})
} catch (error) {
    return res.status(500).json({error:`${error}`})
}} 


















module.exports = Addprofileinfo