const express = require("express")
const app = express()
const http = require("http")
const mongoconnection = require("./db/db")
app.use(express.json())

  const server = http.createServer(app)





try {
  app.use(require("./routes/usersroutes"))
  
} catch (error) {
  console.log(error)
}






  server.listen(7000,()=>{
    console.log("app listening at 7000")
  })