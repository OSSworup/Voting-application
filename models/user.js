const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },

    email:{
        type:String
    },

    mobile:{
        type:String
    },

    address:{
        type:String,
        required:true
    },

    adhaarCardnumber:{
        type:Number,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },

    isVoted:{
        type:Boolean,
        default:false
    }

});

userSchema.pre('save', async function(next){
    const User= this;
    
    if(!User.isModified('password')) return next();
    
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(User.password,salt);
        User.password=hashedPassword;
        next();
    }catch(err){
        next(err);
    }
})

userSchema.methods.comparePassword=async function(candidatePassword){
    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User=new mongoose.model('User',userSchema);
module.exports=User;
