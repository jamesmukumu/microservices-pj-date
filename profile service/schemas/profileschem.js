const db = require("../db/connection")
const Sequelize = db.Sequelize
const sequelize = db.sequelize
const Furtherdetails = require('./moredetailsprof')


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
Profile.hasOne(Furtherdetails)

Profile.sync()

//export
module.exports = Profile