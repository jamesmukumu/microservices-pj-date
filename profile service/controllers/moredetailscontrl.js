const Furtherdetails = require("../schemas/moredetailsprof")
const amqp = require("amqplib")
var channel,connection


//create a channel communication

async function Connectionwithuserservice(){
try {

    const rabbitServer = "amqp://localhost:5672"
    connection = await amqp.connect(rabbitServer)
    channel = await connection.createChannel() 
    await channel.assertQueue("communication")    

} catch (error) {
    console.log(error) 
}  
   
}
 


// add more profile details

async function Addprofileinfo(req,res){
try {
    await Connectionwithuserservice()
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