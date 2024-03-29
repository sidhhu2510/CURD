const express = require('express');
const authController=require('../controllers/auth')
const router = express.Router();
const { verifyToken } = require('../controllers/auth')


router.get('/',verifyToken, (req, res) => {
    
    res.render('change_password.hbs');

});

router.post('/',authController.changepassword)

module.exports = router;