import mongoose from "mongoose";

const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then((res)=>{
        console.log("Mongoose is Connected")
    })
    .catch((err)=>{
        console.log("Mongoose not Connected error",err)
    })
}

export default dbConnection