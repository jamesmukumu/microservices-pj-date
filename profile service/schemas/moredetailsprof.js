const db = require("../db/connection")
const Profile = require('./profileschem')
const Sequelize = db.Sequelize
const sequelize = db.sequelize


const Furtherdetails  = sequelize.define("additionaldetails",{
Hobbies:{
    type:Sequelize.TEXT
},
imageMain:{
    type:Sequelize.TEXT,
    unique:true
},
image2:{
    type:Sequelize.TEXT,
    unique:true
},
image3:{
    type:Sequelize.TEXT,
    unique:true
},
image4:{
    type:Sequelize.TEXT,
    unique:true
},
RelationshipStatus:{
    type:Sequelize.STRING,
    allowNull:false
},
Desireandwants:{
    type:Sequelize.STRING
},
phoneNumber:{
    type:Sequelize.TEXT,
 
    unique:true,
    allowNull:false,
    references:{
        model:"Profile",
        key:"phoneNumber"
    }
}





})







Furtherdetails.belongsTo(Profile)


module.exports = Furtherdetails