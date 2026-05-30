import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {addComment,getComment} from "../controllers/commentControllers.js"
const router = express.Router()

router.post("/comment/:id",authMiddleware,addComment)
router.get("/comment/:id",getComment)

export default router