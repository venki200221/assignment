var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var middleware= require('../middleware/middleware');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

router.post('/login', function(req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
          var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      var token = jwt.sign({ id: user._id },"hey tis is secret", {
        expiresIn: 86400 
      });
      res.status(200).send({ auth: true, token: token,email:req.body.email });
    });
  
});

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

router.post('/register', function(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
    User.create({
      name : req.body.name,
      email : req.body.email,
      password : hashedPassword
    }, 
    function (err, user) {
      if (err) return res.status(400).send("There was a problem registering the user`.");  //if user already exists
      var token = jwt.sign({ id: user._id },"hey tis is secret", {
        expiresIn: 86400
      });
  
      res.status(200).send({ auth: true, token: token,email:req.body.email });
    });
});


router.put("/:userid",async(req,res)=>{
    var userid=req.params.userid;
   try{
    await User.findOneAndUpdate({_id:userid},{
      $set:{
        mobile:req.body.mobile,
        profile_pic:req.body.profile_pic
      }
    });
    res.send("sucessfully updated the user");
  
  }
   catch(err){
    res.send(400).json(err);
   }
});

router.delete("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id){
        try{
            try{
               
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User sucessfully deleted");
                 
           
            }catch(err){
             res.status(500).json(err);
            }
        }catch(err){
          res.status(404).json("User not found")
        }

        
    }
    else{
        res.status(401).json("not found")
    }
    
    
});

router.get("/:id",async(req,res)=>{
    try{
        const user =await User.findById(req.params.id);
        const {password,...others}=user._doc;
        res.status(200).json(others);

    }catch(err){
        res.status(500).json(err);
    }
});



module.exports = router;