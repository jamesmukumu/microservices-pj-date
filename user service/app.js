const express = require("express")
const app = express()
const http = require("http")
const mongoconnection = require("./db/db")
const amqp = require("amqplib")
var channel
var connection
app.use(express.json())

  const server = http.createServer(app)



 


//create a channel communication

async function Connectionwithuserservice(){
  try {
  
      const rabbitServer = "amqp://localhost:5672"
      connection = await amqp.connect(rabbitServer)
      channel = await connection.createChannel() 
      await channel.assertQueue("profileNumber")  
      channel.consume("profileNumber",(data)=>{
       console.log(`${Buffer.from(data.content)}`)
     channel.ack(data)
      })  
   
  } catch (error) {
      console.log(error) 
  }  
      
  }
  Connectionwithuserservice();





try {
  app.use(require("./routes/usersroutes"))
  
} catch (error) {
  console.log(error)
}






  server.listen(7000,()=>{
    console.log("app listening at 7000")
  })