import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//signup

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      password: hashedPassword,
    });
    await user.save();

    return res.status(201).json({ message: "account create successfull" });
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:'server error'})
  }
};

// login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 3. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatched = await bcrypt.compare(password,user.password);
    if(!isMatched){
        return res.status(400).json({message:"invalid credentials"})
    }
     const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token valid for 1 day
    );


     res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};


export {signup,login}