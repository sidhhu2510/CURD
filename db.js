const MySQL = require("mysql");


const db = MySQL.createConnection({
    host: process.env.DATABASE_host,
    user: process.env.DATABASE_user,
    password: process.env.DATABASE_password,
    database: process.env.DATABASE,
 });
 
 db.connect((err)=>{
   if (err) {
     console.error('Error connecting to MySQL:', err);
     return;
   }
   else {console.log('Connected to MySQL!');}
 })
 module.exports=db;