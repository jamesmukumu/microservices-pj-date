const db = require("../db/connection")

const Sequelize = db.Sequelize
const sequelize = db.sequelize


const Furtherdetails  = sequelize.define("additionaldetails",{
Hobbies:{
    type:Sequelize.TEXT,
    allowNull:false,
   
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
    allowNull:false,
    validate:{
        isIn:[["Single","Dating","Complicated","Married","Divorced","Searching","Looking for fun"]]
    }
},
Desireandwants:{
    type:Sequelize.STRING,
    validate:{
        isIn:[['Fun','One night stand','Sex','Seeking love']]
    }
}



})
 
 
  



module.exports = Furtherdetails