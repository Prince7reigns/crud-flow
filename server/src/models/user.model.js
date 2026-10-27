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
        },
        refreshTokenHash: { 
            type: String, 
            select: false 
        },
    },
    {
       timestamps: true 
    }
);

userSchema.pre('save',async function(password){
    if(!this.isModified('password')) return;
       this.password= await bcrypt.hash(this.password,12);next()
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.set('toJSON'),{
  transform:(_doc,ret)=>{
    delete ret.password;
    delete ret.refreshTokenHash;
    delete ret.__v;
   }
}



export const User = mongoose.model('user',userSchema);