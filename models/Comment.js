import mongoose, { Mongoose } from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        postId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",

        },
        comment:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

export default mongoose.model("Comment",CommentSchema)