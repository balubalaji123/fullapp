const express=require('express')
const router=express.Router()
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbo=''
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   dbo = db.db("flipr");
});
var users=[{}]

router.post('/',function(req,res){
    // to check if user already exists
    var query={usermail:req.body.mail}
    dbo.collection("customers").find(query).toArray(function(err,result){
        if(err)throw err
        if(result.length){
            res.send(JSON.stringify("user already exists"))
        }
        else{
            // send confomation mail to user
            var check=Math.random()
var obj={id:check,username:req.body.name,usermail:req.body.mail,userpassword:req.body.password}
users.push(obj)
// to send mail
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wolvesofthevalleysspardha@gmail.com',
      pass: 'fmt@12345'
    }
  });
  var mailOptions = {
    from: 'Flipr Hackathon',
    to: req.body.mail,
    subject: 'account conformation',
  html:'welcome  '+req.body.name+'   to Flipr Hackathon to confirm your mail <a href="http://localhost:3000/signup?id='+check+'&&mail='+req.body.mail +'">click</a><br>'
  };  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent for general login');
    }
  });
  res.send(JSON.stringify("mailsent"))
        }
    })
})
// to verify the mail
router.get('/',function(req,res){
var id=req.query['id']
var t
var mail=req.query['mail']
var check=0
for(i=0;i<users.length;i++){
    if(users[i].id==id && users[i].usermail==mail){
        check=1
    //insert details into the database
    dbo.collection("customers").insertOne(users[i],function(err,result){
        if(err)throw err
        users.splice(i,1) 
        res.sendFile(__dirname+'/confirmation.html')
    })  
    }   
}
if(check==0){
    res.send(JSON.stringify('There is internal While Verifying Your Mail'))
}
})
module.exports=router