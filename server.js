import app from "./app.js"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import dbConnection from "./config/dbConfig.js"
import postRoutes from "./routes/postRoutes.js"
import commentRouter from "./routes/commentRoutes.js"

dotenv.config()

// Auth Routes
app.use("/api/auth", authRoutes);

//PostRoutes
app.use("/api/posts",postRoutes)

// CommentRouter
app.use("/api/post",commentRouter)

const PORT = process.env.PORT || 5000

// Database connection
dbConnection();

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`server is running at port ${PORT}`)
})






