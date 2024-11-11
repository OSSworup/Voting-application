const express=require('express');
const router=express.Router();
const User=require('../models/user');
const {jwtAuthMiddleware,generateToken}=require('../jwt');

router.post('/signup',async (req,res)=>{
  try{
    const data=req.body;
  
    const newUser=new User(data);
    
    const response=await newUser.save();
    console.log("data is saved");

    const payload={
      id:response.id
    }

    console.log(JSON.stringify(payload));
    const token=generateToken(payload);
    console.log('Token is :',token);

    res.status(200).json({response:response,token:token});
  
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});
  }
})
  
//login route

router.post('/login', async(req,res)=>{
  try{
    const {adhaarCardnumber,password}=req.body;
    const user=await User.findOne({adhaarCardnumber:adhaarCardnumber});
    if(!user || !(await user.comparePassword(password)))
    {
      return res.status(401).json({error:'Incorrect adhaarCard Number or Password'})
    }

    const payload={
      id:user.id
    }

    const token=generateToken(payload);
    res.json({token:token});
  }catch(err){
    console.log(err);
    res.status(500).json({Error:"Internal Server Error"});
  }
})

router.get('/profile',jwtAuthMiddleware,async (req,res)=>{
  try{
    const userData=req.user;
    const response=await User.findById(userData.id);
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({Error:"Internal Server Error"});
  }
})


router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
  try{
    const userId=req.user;
    const {currentPassword,newPassword}=req.body;
    const user=await User.findById(userId.id);
    if(!(await user.comparePassword(currentPassword)))
    {
        return res.status(401).json({error:'Incorrect Password'})
    }

    user.password=newPassword;
    await user.save();
    
    console.log('Password updated');
    res.status(200).json({Message:'Password Updated'});
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});   
  }
});


module.exports=router;