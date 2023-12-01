const express = require("express")
const router = express.Router()
const {Registeruser,loginUser,changePassword,loginwithRecoveryPassword,validateEmailandgetrecoveryPass} = require("../controllers/usercontrl")


router.post('/register/user',Registeruser)
router.post('/login/user',loginUser)
router.post('/login/recoverypassword',loginwithRecoveryPassword)
router.put('/change/password',changePassword)
router.post('/validate/email',validateEmailandgetrecoveryPass)
module.exports = router
 