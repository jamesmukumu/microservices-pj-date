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








try {
    app.use(require('./routes/addprofileinforroute'))
} catch (error) {
   console.log(error) 
} 



  

try {
    app.use(require('./routes/profileroutes'))
} catch (error) {
   console.log(error) 
} 








server.listen(5000,()=>{
    console.log("app listening at 5000")
})