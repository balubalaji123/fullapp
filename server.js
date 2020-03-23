const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const signup=require('./server/signup')
const login=require('./server/login')
const dashboard=require('./server/dashboard')
const forgotpassword=require('./server/forgotpassword')
var cookieParser = require('cookie-parser');
const session=require('express-session')
var sess={
  name:'sid',
  resave:false,
  saveUninitialized:true,
  secret:'a',
  cookie:{
    maxAge:100*60*69*2,
    sameSite:false,
    secure:false,
    httpOnly:false,
  }  
}
app.use(session(sess))
const path=require('path')
app.use(express.static(path.join(__dirname,'dist/fliprmeanstack')))
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use('/signup',signup)
app.use('/login',login)
app.use('/forgotpassword',forgotpassword)
app.use('/dashboard',dashboard)
app.get('/*',function(req,res){
    res.sendFile(__dirname+'/dist/fliprmeanstack/index.html')
  })
app.listen(3000)
