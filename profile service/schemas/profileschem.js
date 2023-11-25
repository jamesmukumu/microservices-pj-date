const db = require("../db/connection")
const Sequelize = db.Sequelize
const sequelize = db.Sequelize



const Profile = sequelize.define("profilestable",{

Profilename:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:true
},
age:{
    type:Sequelize.INTEGER,
    allowNull:false,
},
birthDate:{
    type:Sequelize.TEXT,
    allowNull:false
},
Nationality:{
    type:Sequelize.STRING,
    allowNull:false
},
phoneNumber:{
    type:Sequelize.TEXT,
    primaryKey:true,
    unique:true
}




})

//export
module.exports = Profile