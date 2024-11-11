const express=require('express');
const router=express.Router();
const Candidate=require('../models/candidate');
const User=require('../models/user');
const {jwtAuthMiddleware,generateToken}=require('../jwt');

const checkAdminRole=async (userID)=>{
    try{
        const user=await User.findById(userID);
        return user.role ==='admin';
    }catch(err){
        return false;
    }
}

router.post('/',jwtAuthMiddleware,async (req,res)=>{
  try{
    if(!(await checkAdminRole(req.user.id)))
        return res.status(403).json({error:'user does not have admin role'});

    const data=req.body;  
    const newCandidate=new Candidate(data);   
    const response=await newCandidate.save();
    console.log("data is saved");
    res.status(200).json({response:response});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});
  }
})
  

router.put('/:candidateId',jwtAuthMiddleware,async(req,res)=>{
try{
    if(!(await checkAdminRole(req.user.id)))
        return res.status(403).json({error:'user does not have admin role'});

    const candidateId=req.params.candidateId;
    const updatedCandidateData=req.body;
    const response=await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData,{
        new:true,
        runValidators:true
    });
    
    if(!response){
        res.status(404).json({Error:"Candidate not found"});
    }
    
    console.log('Data updated');
    res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});   
    }
});

router.delete('/:candidateId',jwtAuthMiddleware,async(req,res)=>{
try{
    if(!(await checkAdminRole(req.user.id)))
        return res.status(403).json({error:'user does not have admin role'});

    const candidateId=req.params.candidateId;
    const response=await Candidate.findByIdAndDelete(candidateId);
        
    if(!response){
        res.status(404).json({Error:"Candidate not found"});
    }
        
    console.log('Data deleted');
    res.status(200).json({message:'Candidate Deleted'});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});   
    }
});

router.get('/', async(req,res)=>{
    try{
        const candidate=await Candidate.find();
        res.status(200).json(candidate);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});  
    }
})

router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    const candidateID=req.params.candidateID;
    const userID=req.user.id;

    try{
        const candidate=await Candidate.findById(candidateID);
        if(!candidateID){
            return res.status(404).json({message:"Candidate not found"});
        }

        const user=await User.findById(userID);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        if(user.isVoted){
            return res.status(400).json({message:"User has already voted"});
        }

        if(user.role == 'admin'){
            return res.status(403).json({message:"admin not allowed"});
        }

        candidate.votes.push({user:userID});
        candidate.voteCount++;
        await candidate.save();

        user.isVoted=true;
        await user.save();

        res.status(200).json({message:"vote recorded successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});  
    }
});

router.get('/vote/count',async(req,res)=>{
    try{
        const candidate=await Candidate.find().sort({voteCount:'desc'});

        const voteRecord=candidate.map((data)=>{
            return {
                name:data.name,
                party:data.party,
                voteCount:data.voteCount
            }
        });
        res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});  
    }
})

module.exports=router;