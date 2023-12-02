const express = require("express")
const app = express()
const http = require("http")
const amqp = require("amqplib")
const axios = require("axios")
const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require('nodemailer')


const transpoter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.usergmail,
        pass:process.env.gmailPassword
    }
})




var connection
var channel


let phonecont
 
var connectionEmail
var channelEmail

var Useremail


async function getEmail(){
try {
    connectionEmail = await amqp.connect('amqp://localhost:5672')
    channelEmail = await connectionEmail.createChannel()
    await channelEmail.assertQueue("useremail")
    channelEmail.consume("useremail",(data)=>{
     Useremail = `${Buffer.from(data.content)}`
     channelEmail.ack(data)
     console.log(Useremail)
    })
    
} catch (error) {
    console.log(error)
}
 
}


getEmail()








async function getPhonenumber(){
try {
     connection = await amqp.connect("amqp://localhost:5672")
     channel =  await connection.createChannel()
      await channel.assertQueue("profileNumber" )
     await channel.consume("profileNumber",(data)=>{
        phonecont = `${Buffer.from(data.content)}`
        console.log(phonecont)
        channel.ack(data)
      })
} catch (error) { 
   console.log(error) 
}

} 

var checkoutlink
 
async function generatePaymentlink(req, res) {
    await getPhonenumber()

    try {
        const response = await axios.post("https://sandbox.intasend.com/api/v1/checkout/", {
            public_key:process.env.publicKey,
            phone_number: phonecont, 
            amount:5000
        
        }
        );
        checkoutlink = response.data.url 
        
         console.log(response.data.url)
        return res.status(200).json(response.data.url); 
    } catch (error) {
        console.error(error);
        return res.status(500).json(error.response.data);
    }
}



async function sendCheckoutUrl(req,res,checkoutUrl){
   
    try{
    const mailOptions = {
        to:Useremail,
        from:process.env.usergmail,
        subject:"Check Out URL",
        html:`<p>${checkoutlink}</p>`

    }

    await transpoter.sendMail(mailOptions)
    return res.status(200).json({message:"Check out sent"})
    }
    catch(error){
return res.status(500).json({error:`${error}`})
    }


}






 

 
app.post('/post/payment',generatePaymentlink)
app.post('/send/checkout/email',sendCheckoutUrl)




const server = http.createServer(app)
 
server.listen(process.env.port,()=>{
console.log("app listening at 8080")

})