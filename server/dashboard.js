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
    var insertquery={usermail:req.session.usermail,board:req.body.boardname,cards:[{}]}
    dbo.collection("cards").insertOne(insertquery,function(err,result){
        if(err)throw err
        dbo.collection("cards").find({usermail:req.session.usermail}).toArray(function(err,result){
            if(err)throw err
            console.log('res',result)
            res.json(result)
        })
    
    })
    
})
// to send initial card details
router.get('/',function(req,res){
    var findquery={usermail:req.session.usermail}
    dbo.collection("cards").find(findquery).toArray(function(err,result){
        if(err)throw err
        console.log('res',result)
        res.json(result)
    })
})
// to send intial crds of a particular board
router.post('/cards',function(req,res){
    var findquery={usermail:req.session.usermail,board:req.body.boardname}
    dbo.collection('cards').find(findquery).toArray(function(err,result){
        if(err)throw err
        res.json(result[0])
    })
})
router.post('/createcard',function(req,res){
    var findquery={usermail:req.session.usermail,board:req.body.board}
    dbo.collection("cards").find(findquery).toArray(function(err,response){
        if(err) throw err
        // it is first card
        console.log(response[0].cards.length)
        if(response[0].cards.length==0){
            var updatearr=[]
            var c={}
            c[req.body.cardname]=[]
            c1={cardname:c}
            updatearr.push(c1)
            updatequery={$set:{cards:updatearr}}
            dbo.collection('cards').update(findquery,updatequery,function(err,response){
                if(err)throw err
                dbo.collection('cards').find(findquery).toArray(function(err,result){
                    if(err)throw err
                    res.json(result[0])
                })

            })
        }
        else{
            var updatearr=response[0].cards
            var c={}
            c[req.body.cardname]=[]
            updatearr.push(c)
            updatequery={$set:{cards:updatearr}}
            dbo.collection('cards').update(findquery,updatequery,function(err,response){
                if(err)throw err
                dbo.collection('cards').find(findquery).toArray(function(err,result){
                    if(err)throw err
                    res.json(result[0])
                })

            })
  

        }
    })
})

module.exports=router