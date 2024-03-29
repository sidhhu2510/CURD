const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/auth')


// router.get('/forgot', (req, res) => {
//     res.render('forgot.hbs');
// });

router.get('/', verifyToken, (req, res) => {
    // Render home page or any other authenticated page
    res.render('home');
});

// router.get('/home', (req, res) => {
//     res.render('home.hbs');

// });

// router.get('/change_password',verifyToken, (req, res) => {
    
//     res.render('change_password.hbs');

// });

// router.get('/register', (req, res) => {
//     res.render('register.hbs');
// });


// router.get('/change-password', (req, res) => {
//     var token = req.query.token;
//     // console.log(token);
//     res.render('change-password.hbs', { token: token });
// });



module.exports = router;