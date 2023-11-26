const express = require("express")
const router = express.Router()
const {Registeruser,loginUser,changePassword} = require("../controllers/usercontrl")


router.post('/register/user',Registeruser)
router.post('/login/user',loginUser)
router.put('/change/password',changePassword)
module.exports = router
 