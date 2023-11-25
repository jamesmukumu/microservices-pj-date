const express = require("express")
const app = express()
const http = require("http")
const db = require("./db/connection")
db.sequelize.sync()
.then(()=>{
    console.log("connected to pg successfully")
})
.catch((error)=>{
    console.log(error)
})   



app.use(express.json())


const server = http.createServer(app)

server.listen(5000,()=>{
    console.log("app listening at 5000")
})