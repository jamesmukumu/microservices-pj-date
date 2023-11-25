const Sequelize = require("sequelize")
const configdb = require('./config')


  
const sequelize = new Sequelize(configdb.database,configdb.admin,configdb.password,{
port:configdb.port,
host:configdb.host,
dialect:"postgres",

dialectOptions:{
    ssl:{
        require:true,
        rejectUnauthorized:true
    }
},
pool:{
    max:5,
    min:0,
    acquire:70000,
    idle:1000
}

 
})


const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
module.exports = db