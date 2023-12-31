const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()


mongoose.set("debug",true)

const mongoconnection =  mongoose.connect(process.env.mongoConnect,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    .then(()=>{console.log("connected to the mongodb ")})
    .catch((error)=>{
        console.log(`${error}`)
    })

module.exports = mongoconnection  