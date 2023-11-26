const router = require("express").Router()

const createdProfile = require('../controllers/profilecontent')



router.post('/create/profile',createdProfile)

module.exports = router