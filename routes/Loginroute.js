const express = require('express');
const authController=require('../controllers/auth')
const router = express.Router();

router.get('/', (req, res) => {
   res.render('Login.hbs');
});

router.post('/',authController.Login)

module.exports = router;
 