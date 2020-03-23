const express=require('express')
const router=express.Router()
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbo=''
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   dbo = db.db("flipr");
});
router.post('/',function(req,res){
    var query={usermail:req.body.usermail}
    dbo.collection("customers").find(query).toArray(function(err,result){
        if(err)throw err
        if(result.length==0){
            res.send(JSON.stringify("not exists"))
        }
       else if(result[0].userpassword===req.body.userpassword){
            req.session.usermail=req.body.usermail
            res.send(JSON.stringify("ok"))
        }
        else {
            res.send(JSON.stringify("password wrong"))
        }
    })
})
module.exports=router