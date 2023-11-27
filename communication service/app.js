const express = require("express")
const app = express()
const http = require("http")
const {Server} = require("socket.io")

const server = http.createServer(app)


const io = new Server(server)





io.on('connection',(socket)=>{
console.log(`${socket.id} has established a connection`)
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