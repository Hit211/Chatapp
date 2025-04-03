import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async(req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:senderId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:senderId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
}

export const sendMessage = async(req,res)=>{
    try {
        
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imgUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }
    
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imgUrl
        })

        await newMessage.save();

        res.status(201).json({
            newMessage
        })

    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
}