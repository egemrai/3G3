import { RequestHandler } from "express";
import { Conversation as ConversationModel,Message as MessageModel } from "../models/chat";
import createHttpError from "http-errors";
import { io } from "../server";
import { userSocketMap } from "../server";

// interface Conversation{  //populate kullandığım için type'ı bu şekilde vermem gerekiyor
//     participants:any
//     messages:Message[]
//     createdAt:string
//     updatedAt:string
// }

// interface Message{
//     senderId:any
//     receiverId:any
//     message:string
//     createdAt:string
//     updatedAt:string
//     seenByReceiver:boolean
//     sent:boolean
// }


export const fetchAllConversations:RequestHandler= async(req, res, next) =>{
    const userId = req.session.userId
    try {
        if(!userId){
            throw createHttpError(400,"userId yok")
        } 
        
        const allConversations = await ConversationModel.find({participants:{$in:[userId]}}).populate({
        path: "messages",
        populate: [
            { path: "senderId", model: "User" },
            { path: "receiverId", model: "User" }
        ]
        })
        .populate("participants")
        
        res.status(200).json(allConversations)
    } catch (error) {
        next(error)
    }
}

export const sendMessage:RequestHandler= async (req, res, next) => {
    const senderId = req.session.userId
    console.log(req.body)
    const {message,receiverId,messageTemporaryId} = req.body
    
    try {
        if(!senderId){
            throw createHttpError(400,"sendMessage senderId eksik")
        } 
        if(!message){
            throw createHttpError(400,"sendMessage message eksik")
        } 
        if(!receiverId){
            throw createHttpError(400,"sendMessage receiverId eksik")
        } 
        if(!messageTemporaryId){
            throw createHttpError(400,"sendMessage messageTemporaryId eksik")
        } 
        
        let conversation = await ConversationModel.findOne({participants:{ $all: [senderId,receiverId]}})
        let startOfConversation = false
        if(!conversation){
            conversation = await ConversationModel.create({
                participants: [senderId, receiverId]
            })
            startOfConversation = true
        }

        const newMessage = new MessageModel({
            senderId:senderId,
            receiverId:receiverId,
            message:message,
            sent:true
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(),newMessage.save()])

        const fetchedConversation = await ConversationModel.findById(conversation._id).populate("messages").populate("participants")

        const fetchedMessage = await MessageModel.findById(newMessage._id).populate("senderId").populate("receiverId")
        
        // const fetchedMessage = fetchedConversation?.messages.find(message => message._id.toString() === newMessage._id.toString())

        //Socket.emit kısmı
        const receiverSockets = userSocketMap.get(receiverId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function socketSendFirstMessage(fetchedMessage:any,fetchedConversation:any){
            if(receiverSockets){
                receiverSockets.forEach(eachSocketId =>
                    io.to(eachSocketId).emit("socketSendFirstMessage",{
                        message:fetchedMessage,
                        conversation:fetchedConversation
                    })
                )
            }
        }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function socketSendDefaultMessage(fetchedMessage:any,fetchedConversation:any){
            if(receiverSockets){
                receiverSockets.forEach(eachSocketId =>
                    io.to(eachSocketId).emit("socketSendDefaultMessage",{
                        message:fetchedMessage,
                        conversation:fetchedConversation
                    })
                )
            }
        }
        

        if(startOfConversation){
            socketSendFirstMessage(fetchedMessage,fetchedConversation)
            
            res.status(200).json({fetchedConversation:fetchedConversation,fetchedMessage:fetchedMessage,messageTemporaryId:messageTemporaryId})
        }
        else{
            socketSendDefaultMessage(fetchedMessage,fetchedConversation)
            res.status(200).json({fetchedMessage:fetchedMessage,messageTemporaryId:messageTemporaryId})
        }
        
    } catch (error) {
        next(error)
    }
}




export const deleteAllConversationsAndMessages:RequestHandler= async(req,res,next)=>{  //Postman için tüm collection silme requesti, websitesinde yok
    try {
        Promise.all([await ConversationModel.deleteMany({}), await MessageModel.deleteMany({})]) 
        res.status(200).json(true)
    } catch (error) {
        next(error)
    }
}





