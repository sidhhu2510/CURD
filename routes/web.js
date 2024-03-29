const router = require('express').Router();

// const logRoute =require('./Login')
const logRoute =require('./Loginroute')
router.use('/Login',logRoute)

const register =require('./Register')
router.use('/Register',register)

const Resetpassword =require('./Resetpassword')
router.use('/Resetpassword',Resetpassword)

const forgot =require('./ForgotPassword')
router.use('/Forgotpassword',forgot)

const Changepassword =require('./Changepassword')
router.use('/Changepassword',Changepassword)

const Pages =require('./pages')
router.use('/',Pages)

module.exports = router;