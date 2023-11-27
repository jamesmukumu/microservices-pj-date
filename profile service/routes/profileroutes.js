const router = require("express").Router()

const {makeProfile,seeProfile,filterSearchesonages,filterOnnationality} = require('../controllers/profilecontent')



router.post('/create/profile',makeProfile)
router.get('/get/profile/details',seeProfile)
router.get('/filter/profiles/agewise',filterSearchesonages)
router.get('/filter/nationality',filterOnnationality)
module.exports = router 