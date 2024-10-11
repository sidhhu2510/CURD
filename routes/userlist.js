const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userlist = require('../severes/userlist');
const db = require("../db");
// const Auth = require('../../services/auth');
const bcrypt = require('bcryptjs');

//GET TP FOLLOW
router.get('/', async function (req, res, next) {
  try {
    userlist.get((err, data, resCode) => {
      // console.log(data);
      if (err)
        res.status(resCode || 500).render('index.ejs', {
          status: false,
          message:
            err.message || err || "Some error occurred while getting"
        });
      else res.render('index1.ejs', data);
    })
  } catch (err) {
    console.error(`Error while getting user list`, err.message);
    next(err);
  }
});

router.get('/create', async function (req, res, next) {

      res.render('userlist/register.ejs');


});

router.post('/create', async function (req, res, next) {

  try {
    const { fristname, lastname, phone, eMail, address } = req.body;

    // Check if any required field is missing
    if (!fristname || !lastname || !phone || !eMail || !address) {
      res.render('userlist/register.ejs', { status: false, message: "Content can not be empty!" });
    }
    userlist.create(fristname, lastname, phone, eMail, address, (err, data, resCode) => {
      if (err)
        res.render('userlist/register.ejs', {
          status: false,
          message:
            err.message || err || "Some error occurred while creating the user list."
        });
    
      else res.redirect("/");
    })
  } 
  catch (err) {
    console.error(`Error while getting in user list`, err.message);

    res.redirect("userlist/register.ejs");
  }
});


router.get('/edit/:id', async function (req, res, next) {
  try {
      let id = req.params.id;
      userlist.getById(id, (err, data) => {
          if (err) {
              res.status(500).render('index.ejs', {
                  status: false,
                  message: err.message || "Some error occurred while getting the user list."
              });
          } else {
            // console.log(data)
              res.render('userlist/update_register.ejs', data);
          }
      });
  } catch (err) {
      console.error(`Error while getting user list`, err.message);
      next(err);
  }
});


router.post('/edit/:id', async function (req, res, next) {
  try {
      const { fristname, lastname, phone, eMail, address} = req.body;
      let ids = req.params.id;
    

      // Check if any required field is missing or passwords don't match
      if (!fristname || !lastname || !phone || !eMail || !address) {
          return res.render('userlist/update_register.ejs', { status: false, message: "Content can not be empty!" });
      }
    
      userlist.updateById(ids, fristname, lastname, phone, eMail, address, (err, data) => {
          if (err) {
              return res.render('userlist/update_register.ejs', {
                  status: false,
                  message: err.message || "Some error occurred while updating the user."
              });
          }
          // console.log(data)
          res.redirect("/");
      });
  } catch (err) {
      console.error(`Error while updating user:`, err.message);
      res.redirect("/userlist");
  }
});



router.delete('/delete/:id', async function (req, res, next) {
  try {
    // Validate request

    let id = req.params.id;
    userlist.remove(id, (err, data, resCode) => {
      if (err)
        res.status(resCode || 500).send({
          status: false,
          message:
            err.message || err || "Some error occurred while Deleting the users list."
        });
      else res.send(data);
    })
  } catch (err) {
    console.error(`Error while users list`, err.message);
    next(err);
  }
});


module.exports = router;