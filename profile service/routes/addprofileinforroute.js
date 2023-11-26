const router = require("express").Router()
const Addprofileinfo = require('../controllers/moredetailscontrl')


router.post('/more/about/info',Addprofileinfo)
module.exports = router
