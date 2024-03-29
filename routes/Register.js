const express = require('express');
const authController=require('../controllers/auth')
const router = express.Router();

router.get('/', (req, res) => {
    res.render('register.hbs');
});

router.post('/',authController.register)

module.exports = router;