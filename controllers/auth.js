const MySQL = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcryptjs library
const cookieparser = require('cookie-parser');
const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');

const db = require("../db");




exports.Login = async (req, res) => {
   try {
      const { eMail, passWord } = req.body;
      // console.log(eMail)
      // console.log(passWord)

      if (!eMail || !passWord) {
         return res.status(400).render('Login', {
            message: "You need to enter both eMail and passWord"
         });
      }

      db.query('SELECT * FROM register WHERE eMail = ?', [eMail], async (error, results) => {
         if (error) {
            console.log(error);
            return res.status(500).render('Login', {
               message: "Internal server error"
            });
         }
         // console.log(results)
         if (!results || results.length === 0) {
            return res.status(401).render('Login', {
               message: "User Not Found"
            });
         }

         const user = results[0];
         const isPassWordCorrect = await bcrypt.compare(passWord, user.passWord);

         if (!isPassWordCorrect) {
            return res.status(401).render('Login', {
               message: "Invalid passWord"
            });
         }

         // PassWord is correct, proceed with generating JWT token and setting cookie
         const id = user.id;
         const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
         });

         const cookieOptions = {
            expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 10 * 60 * 1000),
            httpOnly: true
         };
         res.cookie('jwt', token, cookieOptions);
         res.status(200).redirect('/');
      });
   } catch (error) {
      console.log(error);
      res.status(500).render('Login', {
         message: "Internal server error"
      });
   }
}


exports.changepassword = async (req, res) => {
   try {

      const {passWord, passWord1, passWord2 } = req.body
      if (!passWord || !passWord1 || !passWord2) {
         return res.status(400).render('change_password', {
            message: "You need to enter both old password and passWord"

         });
      }

      if (passWord1 !== passWord2) {
         return res.status(400).render('change_password', {
            message: "confirm password  do not match"
         });
      }
      var userId=null;
      const token = req.cookies.jwt;
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
         userId=decodedToken["id"];
      })
      // console.log(userId)
      db.query('SELECT * FROM register WHERE id = ?', [userId], async (error, results) => {
         if (error) {
            console.log(error);
            return res.status(500).render('change_password', {
               message: "Internal server error 1"
            });
         }
         console.log(results)
         if (!results || results.length === 0) {
            return res.status(401).render('change_password', {
               message: "User Not Found"
            });
         }

         const user = results[0];
         const isPassWordCorrect = await bcrypt.compare(passWord, user.passWord);

         if (!isPassWordCorrect) {
            return res.status(401).render('change_password', {
               message: "Invalid old passWord"
            });
         }
         const hashedPassword = await bcrypt.hash(passWord2, 10);
         db.query('UPDATE register SET passWord = ?', [hashedPassword], (error, results) => {


            if (error) {
               console.log(error);
               return res.status(500).render('change_password', {
                  message: "Internal server error 2"
               });
            }

            res.status(200).render('home', {
               message: "Password change successful"
            });

         });
      });

   } 
   catch(error){
      console.log(error);
      res.status(500).render('change_password',{
         message:"internal server error 3"
      });

   }
  
}

exports.verifyToken = (req, res, next) => {
   const token = req.cookies.jwt;

   if (!token) {
      return res.status(401).redirect('/Login');
   }
   jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
         console.log(err.message);
         return res.status(401).redirect('/Login');
      } else {
         // console.log(decodedToken);
         next();
      }
   });
};



exports.register = async (req, res) => {
   try {
      // Destructure the request body to extract the user input
      const { userName, eMail, passWord, password2 } = req.body;

      // Check if any required field is missing
      if (!userName || !eMail || !passWord || !password2) {
         return res.status(400).render('register', {
            message: "All fields are required"
         });
      }

      // Check if the passwords match
      if (passWord !== password2) {
         return res.status(400).render('register', {
            message: "Passwords do not match"
         });
      }

      // Hash the password
      // const hashedPassword = await bcrypt.hash(passWord, process.env.JWT_SALT); // Increase the salt rounds for better security
      const hashedPassword = await bcrypt.hash(passWord, 10);
      // Check if the email is already registered
      db.query('SELECT * FROM register WHERE eMail = ?', [eMail], async (error, results) => {
         if (error) {
            console.log(error);
            return res.status(500).render('register', {
               message: "Internal server error 1"
            });
         }

         if (results.length > 0) {
            return res.status(400).render('register', {
               message: "Email is already registered"
            });
         }

         // Insert the user data into the database
         db.query('INSERT INTO register SET ?', { userName, eMail, passWord: hashedPassword }, (error, results) => {
            if (error) {
               console.log(error);
               return res.status(500).render('register', {
                  message: "Internal server error 2"
               });
            }

            console.log("User registered successfully:", results);
            // Redirect to the login page after successful registration
            return res.status(200).redirect('/');

            // console.log("User registered successfully:", results);
            // return res.status(200).render('register', {
            //    message: "User registered successfully"
            // });
         });
      });
   } catch (error) {
      console.log(error);
      res.status(500).render('register', {
         message: "Internal server error 3"
      });
   }
}


exports.forgotPassword = async (req, res) => {
   try {
      const { eMail } = req.body;

      if (!eMail) {
         return res.status(400).render('forgot', {
            message: "Please enter your email address"
         });
      }

      db.query('SELECT * FROM register WHERE eMail = ?', [eMail], async (error, results) => {
         if (error) {
            console.log(error);
            return res.status(500).render('forgot', {
               message: "Internal server error 1"
            });
         }

         if (!results || results.length === 0) {
            return res.status(401).render('forgot', {
               message: "No user found with that email address"
            });
         }

         // const user = results[0];
         // const id = user.id;
         // const token = jwt.sign({ id }, process.env.JWT_SECRET, {
         //    expiresIn: process.env.JWT_EXPIRES_IN
         // });


         const expiryTime = Date.now() + (10 * 60 * 1000); // 10 minutes from now
         const payload = eMail + expiryTime.toString();
         const token = CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);


         // console.log('token :'+token)

         // const cookieOptions = {
         //    expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
         //    httpOnly: true
         // };
         // res.cookie('jwt', token, cookieOptions);



         // Store token in the database along with user's email and expiration timestamp
         // For simplicity, assume there's a table called 'password_reset_tokens'
         db.query('INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
            [eMail, token, new Date(Date.now() + (10 * 60 * 1000))],
            (error, results) => {
               if (error) {
                  console.log(error);
                  return res.status(500).render('forgot', {
                     message: "Internal server error 2"
                  });
               }
               // Send password reset email to the user
               sendPasswordResetEmail(eMail, token);
               res.status(200).render('forgot', {
                  message: "Password reset email sent. Please check your inbox."
               });
            }
         );
      });
   } catch (error) {
      console.log(error);
      res.status(500).render('forgot', {
         message: "Internal server error 3"
      });
   }
}


exports.resetPassword = async (req, res) => {
   try {
      const { token, passWord, newPassword } = req.body;

      // console.log(token)
      // console.log(passWord)
      // console.log(newPassword)

      if (!token || !passWord || !newPassword) {
         return res.status(400).render('change-password', {
            message: "Please provide both token and new password"
         });
      }

      // Retrieve token details from the database
      db.query('SELECT * FROM password_reset_tokens WHERE token = ? ', [token], async (error, results) => {
         if (error) {
            console.log(error);
            return res.status(500).render('change-password', {
               message: "Internal server error 1"
            });
         }

         if (!results || results.length === 0) {
            return res.status(401).render('change-password', {
               message: "Invalid Data"
            });
         }
         const expiresAt = results[0].expires_at;
         const isUsed = results[0].is_used;
         const password_reset_tokens_id = results[0].id;
         if (new Date(expiresAt) <= new Date() || isUsed == 1) {
            return res.status(401).render('change-password', {
               message: "Expired token"
            });
         }

         if (passWord !== newPassword) {
            return res.status(400).render('change-password', {
               message: "Passwords do not match"
            });
         }

         // Update user's password in the database
         const eMail = results[0].eMail;
         // console.log(eMail)
         const hashedPassword = await bcrypt.hash(newPassword, 8);

         db.query('UPDATE register SET passWord = ? WHERE eMail = ?', [hashedPassword, eMail], (error, results) => {

            // console.log(hashedPassword)
            // console.log(eMail)
            if (error) {
               console.log(error);
               return res.status(500).render('change-password', {
                  message: "Internal server error 2"
               });
            }
            db.query('UPDATE password_reset_tokens SET is_used = "1" WHERE id = ?', [password_reset_tokens_id,], (error, results) => { })
            res.status(200).render('Login', {
               message: "Password reset successful"
            });
         });
      });

   } catch (error) {
      console.log(error);
      res.status(500).render('change-password', {
         message: "Internal server error 3"
      });
   }
}

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
   host: process.env.email_host,
   port: process.env.email_port,
   auth: {
      user: process.env.email_user,
      pass: process.env.email_password


   }
});

// Function to send password reset email
const sendPasswordResetEmail = (recipientEmail, token) => {

   // Email content
   const mailOptions = {
      from: process.env.email_user,
      to: recipientEmail,
      subject: 'Password Reset Request',
      html: `<p>You are receiving this email because a password reset request has been initiated for your account.</p>
               <p>Please click on the following link to reset your password:</p>
               <a href="http://localhost:5000/change-password?token=${token}">Reset Password</a>
               <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
   };

   // Send email
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
         console.log('Error sending email:', error);
      } else {
         console.log('Email sent:', info.response);
      }
   });
};