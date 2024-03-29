const express = require('express');
const authController=require('../controllers/auth')
const router = express.Router();


router.get('/', (req, res) => {
    var token = req.query.token;
    // console.log(token);
    res.render('change-password.hbs', { token: token });
});


router.post('/',authController.resetPassword)

module.exports = router;