// createPost

import { json } from "express";
import Post from "../models/Post.js";
import mongoose from "mongoose";


const createPost = async (req, res) => {
  try {
    const { title, content, image, isPublic } = req.body;
    const newPost = new Post({
      title,
      image,
      content,
      isPublic,
      author: req.user._id || req.user.id,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all posts


const getAllPosts = async (req, res) => {
      try {
     console.log("REQ.USER 👉", req.user);
     const userId = req.user?.id;

    const posts = await Post.find({
      $or: [
        { isPublic: true },
        { author: new mongoose.Types.ObjectId(userId) } // 🔥 KEY FIX
      ]
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
      res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single post
const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id,
      {$inc :{views:1}},
      {new:true}
    ).populate(
      "author",
      "name email",
    );

    if (!post) {
      return res.status(404).json({ message: "Post not Found !" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete single post

const deletePost = async (req, res) => {
  try {
    const delPost = await Post.findById(req.params.id);
    if (!delPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    await delPost.deleteOne();
    res.status(200).json({ message: "post delete successfull" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//editpost
 const editPost =async(req,res)=>{
  const {id}=req.params
  const {title,content,image,isPublic}= req.body;
  try {
    
    const editPost = await Post.findById(id)
    if(!editPost){
      return res.status(401).json({message:"edit post not found"})
    }

    editPost.title=title||editPost.title
    editPost.image=image||editPost.image
    editPost.content=content||editPost.content
    editPost.isPublic = 
  isPublic !== undefined ? isPublic : editPost.isPublic;

    const savedPost = await editPost.save()
    res.status(200).json("post is edited !")
    
  } catch (error) {
    console.log("Edit error",error)
  }
 }

// toggleLike
const toggleLike =async(req,res)=>{
  const {id} = req.params
  const userId = req.user.id
  try {
    const post= await Post.findById(id);
    console.log(post)


    if(!post){
      return res.status(501).json("post not found")
    }
    const alreadyLiked = post.likes.some(
      (uid) => uid.toString() === userId
    );

    if(alreadyLiked){
        post.likes = post.likes.filter((uId)=>
        uId.toString()!== userId)
    }else{
      post.likes.push(userId)
    }
    await post.save()
    
     res.status(201).json({
      message: "Like toggled successfully",
      likes: post.likes.map((like) => like.toString()),
    });

  } catch (error) {
    console.log("Like toggle error")
  }
}

export { createPost, deletePost, getAllPosts, getSinglePost,editPost,toggleLike };

