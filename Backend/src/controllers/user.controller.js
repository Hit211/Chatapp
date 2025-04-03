import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

export const Signup = async(req,res)=>{
    const {fullName,email,password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        if(password.length<6){
            return res.status(400).json({
                message:"Password must be atleast 6 characters"
            })
        }  
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"Email already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword
        });

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                email:newUser.email,
                password:newUser.password,
                profilePic:newUser.profilePic
            })
        }else{
            res.status(400).json({
                message:"Invalid User Data"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message:"Internal Server Error"
        })
    }
}


export const login = async(req,res)=>{
    const {email,password} = req.body;

    try {
      if(!email || !password){
        res.status(400).json({
            message:"Please fill the fields"
        })
      }      
      const user = await User.findOne({email});

      if(!user){
        res.status(500).json({
            message:"This email is not valid"
        })
      }

      const isPasswordMatch = await bcrypt.compare(password,user.password);
      if(!isPasswordMatch){
        res.status(400).json({
            message:"Password is not valid"
        })
      }

      generateToken(user._id,res);

      res.status(200).json({
        message:`Welcome back {user.fullName}`
      })
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


export const logOut = (req,res)=>{
    try {
        res.cookie("token","",{maxAge:0});
        res.status(200).json({
            message:"LogOut Successfully"
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            res.status(400).json({
                message:"ProfilePic is  required"
            })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});

      
        res.status(200).json({message:"UpdatedSuccessfully",updatedUser})

    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}