const router = require("express").Router()

const {makeProfile,seeProfile} = require('../controllers/profilecontent')



router.post('/create/profile',makeProfile)
router.get('/get/profile/details',seeProfile)
module.exports = router 