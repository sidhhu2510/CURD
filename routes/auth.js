const express = require('express');
const authController=require('../controllers/auth')
const router = express.Router();

router.post('/register',authController.register)
router.post('/Login',authController.Login)
router.post('/resetPassword',authController.resetPassword)
router.post('/forgotPassword',authController.forgotPassword)
router.post('/changepassword',authController.changepassword)
module.exports=router;

