import mongoose from "mongoose";
import Comment from "../models/Comment.js";



const addComment =async (req,res)=>{
    
    const {comment} =  req.body
    const {id} = req.params;
    const userId= req.user.id

    try {
        const newcomment = await Comment.create({
            comment,
            postId:id,
            userId
        })
        const populateComment = await newcomment.populate("userId","name")
        console.log(populateComment)
        res.status(201).json(populateComment)
    } catch (error) {
        res.status(500).json("add comment failed")
    }
}
const getComment =async(req,res)=>{
    const {id}=req.params
    try {
        const comments = await Comment.find({postId: new mongoose.Types.ObjectId(id) })
        .populate("userId","name")
        .sort({createdAt:-1})

        res.status(200).json(comments)

        
    } catch (error) {
        res.status(501).json({message:"unable to fetch data"})
    }
}

export  {addComment,getComment}