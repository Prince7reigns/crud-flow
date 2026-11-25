
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxLength:120,
    },
    description:{
      type:String,
      trim:true,
      default:'',
      maxLength:1000
    },
    status:{
        type:String,
        enum:['todo','in-progress','done'],
        default:'todo'
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'low'
    },
    dueDate:{
        type:Date,
        default:null
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true,
        index:true
    },
    
},
{
    timestamps:true
}
)

taskSchema.index({owner:1,status:1,createdAt:-1});
taskSchema.index({title:1,description:1})

taskSchema.set('toJSON', {
  transform: (_d, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; },
});

export const Task = mongoose.model('task', taskSchema);