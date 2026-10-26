import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            maxLength:60
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            select:false
        }
    },
    {
       timestamps: true 
    }
);

userSchema.pre('save',async function(password){
    if(!this.isModified('password')) return;


       this.password= await bcrypt.hash(this.password,12);next()
})

export const User = mongoose.model('user',userSchema);