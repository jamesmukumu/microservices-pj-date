const router = require("express").Router()

const {makeProfile,seeProfile,filterSearchesonages,filterOnnationality,fetchMatchingprofiles} = require('../controllers/profilecontent')



router.post('/create/profile',makeProfile)
router.get('/get/profile/details',seeProfile)
router.get('/filter/profiles/agewise',filterSearchesonages)
router.get('/filter/nationality',filterOnnationality)

 
 router.get('/get/matchingProfiles',fetchMatchingprofiles)
module.exports = router 