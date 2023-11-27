const express = require("express")
const app = express()
const http = require("http")
const {Server} = require("socket.io")
const amqp = require("amqplib")
const server = http.createServer(app)
var usernamereceived

const io = new Server(server)

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

})












server.listen(3500,()=>{
    console.log("app listening at 3500")
})