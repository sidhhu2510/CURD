const express = require('express');
const authController=require('../controllers/auth')
const router = express.Router();


router.get('/', (req, res) => {
    res.render('forgot.hbs');
});


router.post('/',authController.forgotPassword)

module.exports = router;