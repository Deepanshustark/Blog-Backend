import express from "express";
import {createPost,deletePost,getAllPosts,getSinglePost,editPost,toggleLike} from "../controllers/postControllers.js"
import authMiddleware from "../middleware/authMiddleware.js"


const router = express.Router()

router.post("/create",authMiddleware,createPost);
router.get("/",authMiddleware,getAllPosts)          
router.delete("/:id",authMiddleware,deletePost)
router.get("/:id",getSinglePost)   
router.put("/edit/:id",authMiddleware,editPost)
router.put("/like/:id",authMiddleware,toggleLike)


export default router