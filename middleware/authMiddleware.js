import jwt from "jsonwebtoken";

const authMiddleware =(req,res,next)=>{
    try {
        console.log("AUTH HEADER 👉", req.headers.authorization);
        //get token from header

        const authHeader = req.headers.authorization
        // check token provided or not
        if(!authHeader){
          return  res.status(401).json({message:'No Token Provided'})
        }

        const token = authHeader.split(" ")[1]

        if(!token){
          return  res.status(401).json({message:"invalid token formate"})
        }
        
        // verify token
        const decode = jwt.verify(token,process.env.JWT_SECRET)

        // send user as decode

        req.user=decode
        next()


    } catch (error) {
       return res.status(401).json({message:"Invalid or expired Token"})        
    }
}

export default authMiddleware