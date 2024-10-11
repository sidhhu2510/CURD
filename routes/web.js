const router = require('express').Router();


const userlist = require('./userlist');
router.use('/', userlist);

module.exports = router;