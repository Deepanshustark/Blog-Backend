import mongoose, { Mongoose } from "mongoose";


const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    isPublic:{
        type:Boolean,
        default:true
    },
    views:{
        type:Number,
        default:0
    }
    },
    {timestamps:true}
)

export default mongoose.model("Post",PostSchema)