// createPost
import { v2 as cloudinary } from "cloudinary";
// ✅ removed unused `import { json } from "express"`
import Post from "../models/Post.js";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const createPost = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog-posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      title,
      content,
      isPublic,
      image: imageUrl,
      author: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("CREATE POST ERROR:", err); // ✅ log full error, not just message
    res.status(500).json({ message: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    console.log("REQ.USER 👉", req.user);
    const userId = req.user?.id;

    const posts = await Post.find({
      $or: [
        { isPublic: true },
        { author: new mongoose.Types.ObjectId(userId) },
      ],
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not Found !" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content, image, isPublic } = req.body;
  try {
    const editPost = await Post.findById(id);
    if (!editPost) {
      return res.status(401).json({ message: "edit post not found" });
    }

    editPost.title = title || editPost.title;
    editPost.image = image || editPost.image;
    editPost.content = content || editPost.content;
    editPost.isPublic = isPublic !== undefined ? isPublic : editPost.isPublic;

    await editPost.save();
    res.status(200).json("post is edited !");
  } catch (error) {
    console.log("Edit error", error);
    res.status(500).json({ message: error.message }); // ✅ added missing response
  }
};

const toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "post not found" }); // ✅ 404, not 501
    }

    const alreadyLiked = post.likes.some((uid) => uid.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((uId) => uId.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: "Like toggled successfully",
      likes: post.likes.map((like) => like.toString()),
    });
  } catch (error) {
    console.log("Like toggle error", error);
    res.status(500).json({ message: error.message }); // ✅ added missing response
  }
};

export { createPost, deletePost, getAllPosts, getSinglePost, editPost, toggleLike };