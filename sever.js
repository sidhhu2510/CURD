const express = require('express');
const MySQL = require("mysql");
const send = require('send');
const path = require('path');
const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
const cookieparser= require('cookie-parser')
const bodyParser = require('body-parser');

const app = express();

const port = 5001;

app.set('view engine', 'hbs');
const publicDriectory = path.join(__dirname,'./public');
app.use(express.static(publicDriectory));
app.use(cookieparser());
app.use(express.urlencoded({extended:false}));
app.use(express.json())

app.set('views', path.join(__dirname, 'views'));

const webroutes = require('./routes/web')
app.use('/',webroutes)


// API 
app.get("/api",(req,res)=>{
  res.json({
    success:1,
    message:'the api is working fine'
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});