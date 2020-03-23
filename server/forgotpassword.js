const express=require('express')
const router=express.Router()
const users=[{}]
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbo=''
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   dbo = db.db("flipr");
});
const nodemailer=require('nodemailer')
router.post('/',function(req,res){
    var c=Math.floor(100000+ Math.random() * 900000);
    dbo.collection("customers").find({usermail:req.body.mail}).toArray(function(err,response){
      if(err) throw err
      if(response.length){
        // to send mail if usermail exists
        var q={otp:c,usermail:req.body.mail}
users.push(q)
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wolvesofthevalleysspardha@gmail.com',
      pass: 'fmt@12345'
    }
  });
  var mailOptions = {
    from: 'flipr hackathon',
    to: req.body.mail,
    subject: 'change password',
    html:'welcome to flipr hackathon  to change yourpassword enter these otp   '+c
  };  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent for forgot password');
    }
  }); 
  res.send(JSON.stringify("otp sent"))
}
    })
})
router.post('/otp',function(req,res){
  check=0;
    otp=req.body.otp
    mail=req.body.mail
    for(i=0;i<users.length;i++){
        if(users[i].otp==otp && users[i].usermail){
          users.splice(i,1);
          check=1
res.send(JSON.stringify("ok"))
        }
    }
    if(check==0){
      res.send(JSON.stringify("not ok"))


    }
})
router.post('/setpassword',function(req,res){
  var query={usermail:req.body.mail}
  var newvalues={$set:{userpassword:req.body.password}}
  dbo.collection("customers").updateOne(query,newvalues,function(err,result){
    if(err) throw err
    res.send(JSON.stringify("updated"))
  })
})
module.exports=router