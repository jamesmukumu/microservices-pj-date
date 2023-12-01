const express = require("express")
const app = express()
const http = require("http")
const {Server} = require("socket.io")
const amqp = require("amqplib")
const server = http.createServer(app)
const jwt = require("jsonwebtoken")

var usernamereceived

let mytoken
async function getTokenfromlogin(){
    try {
       connection = await amqp.connect('amqp://localhost:5672')
    channel = await connection.createChannel()
    await channel.assertQueue("token")
    channel.consume("token",(data)=>{
    mytoken = `${Buffer.from(data.content)}`
    console.log(mytoken)
    channel.ack(data)
    })
        
    } catch (error) {
        console.log(error)
    } 
    
    } 
      
    getTokenfromlogin() 
  
const io = new Server(server,{
    extraHeaders:{
        Authorization:"djjdjdjdj"
    }
})

var channel
let connection


async function getUsernamefromuserservice(){
try {
   connection = await amqp.connect('amqp://localhost:5672')
channel = await connection.createChannel()
await channel.assertQueue("sendUsername")
channel.consume("sendUsername",(data)=>{
usernamereceived = `${Buffer.from(data.content)}`
console.log(usernamereceived)
channel.ack(data)
})
     
} catch (error) {
    console.log(error)
}

} 
 


    

function validateToken(socket, next) {
    try {
        const token = socket.handshake.headers.token; 
        if (!token) {
            
            return next(new Error('Unauthorized'));
        }

        const validToken = jwt.verify(token, "keynan");
        if (!validToken) {
            return next(new Error('Unauthorized token invalid'));
        } else if (validToken) {
            return next();
        }
    } catch (error) {
        return next(new Error(error.message));
    }
}













io.use(validateToken)




 

 io.on('connection',async (socket)=>{

 const user = await getUsernamefromuserservice()
console.log(`${socket.id} has established a connection with username: ${user}`)
socket.on('joinRoom',(data)=>{
 const room = socket.join(data.room)
 console.log(room)
socket.emit("joinroomresponse",`a user with ${socket.id} had joined room ${data.room}`)
})


socket.on('sendMessage',(data)=>{

io.to(data.room).emit('receivemessage',`${data.content}`)

})


 socket.on("unauthorized",(data)=>{
console.log(data.message)
 })

socket.on("disconnect",()=>{
    socket.emit("disconnectionmade",`disconnectionmade to with ${socket.id}`)
    console.log(`user with id ${socket.id} has lost connection`)
})

})   



 
  

  





server.listen(3500,()=>{
    console.log("app listening at 3500")
})