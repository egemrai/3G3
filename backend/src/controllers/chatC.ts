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

interface setSeenByReceiverTrueQuery{
    conversationId: string
}

export const setSeenByReceiverTrue:RequestHandler<unknown,unknown,unknown,setSeenByReceiverTrueQuery>= async(req, res, next) =>{
    const receiverId = req.session.userId
    const conversationId = req.query.conversationId
    try {
        if(!receiverId){
            throw createHttpError(400,"setSeenByReceiverTrue receiverId yok")
        } 
        if(!conversationId){
            throw createHttpError(400,"setSeenByReceiverTrue conversationId yok")
        } 
        
        const conversation = await ConversationModel.findById(conversationId).populate("messages").lean()

        if (!conversation) {
            throw createHttpError(404, "setSeenByReceiverTrue conversation yok")
        }
        
        const senderId = conversation.participants.find((participant)=>{
            if(participant._id.toString() !== receiverId.toString()){
                return participant._id
            }
        })
        if(!senderId){
            throw createHttpError(404, "setSeenByReceiverTrue senderId yok")
        }


        //Socket.emit kısmı
        const receiverSockets = userSocketMap.get(senderId.toString())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function socketSetSeenByReceiverTrue(conversationId:any,messageSenderId:any){
            if(receiverSockets){
                receiverSockets.forEach(eachSocketId =>{
                    io.to(eachSocketId).emit("socketSetSeenByReceiverTrue",{
                        messageSenderId:messageSenderId,
                        conversationId:conversationId,
                        eachSocketId:eachSocketId,
                        senderId:senderId
                    })
                })
            }
        }
        
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unseenMessageIds = conversation?.messages.map((message:any)=>{
            if(message.senderId!==receiverId && message.seenByReceiver===false){
                
                return message._id.toString()
            }
        })
        

        const cleanedMessageIds = unseenMessageIds.filter(Boolean) // görülmüş mesajlar ve gönderilen mesajlar filtrelenince geriye undefined mesaj idleri kalıyor, onları elemek için

        if(!cleanedMessageIds){
            throw createHttpError(400, "cleanedMessageIds yok")
        }
        const messages = await Promise.all(cleanedMessageIds.map(async (messageId:string)=>{
            const message = await MessageModel.findById(messageId)
            if(message){
                message.seenByReceiver= true
            }
            return message
        }))

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lastResponse = await Promise.all(messages.map(async (message:any)=>{
           return await message.save()
        }))

        if(lastResponse){
            socketSetSeenByReceiverTrue(conversation._id,senderId.toString())
        }
        
        res.status(200).json(true)
    } catch (error) {
        next(error)
    }
}


export const sendMessage:RequestHandler= async (req, res, next) => {
    const senderId = req.session.userId
    
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

        const fetchedConversation = await ConversationModel.findById(conversation._id).populate({path:"messages",
        populate:[
            {path:"senderId", model: "User"},
            {path:"receiverId", model: "User"},
        ]
        }).populate("participants")

        const fetchedMessage = await MessageModel.findById(newMessage._id).populate("senderId").populate("receiverId")
        
        // const fetchedMessage = fetchedConversation?.messages.find(message => message._id.toString() === newMessage._id.toString())

        //Socket.emit kısmı
        const receiverSockets = userSocketMap.get(receiverId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function socketSendFirstMessage(fetchedMessage:any,fetchedConversation:any){
            if(receiverSockets){
                receiverSockets.forEach(eachSocketId =>{
                    io.to(eachSocketId).emit("socketSendFirstMessage",{
                        message:fetchedMessage,
                        conversation:fetchedConversation
                    })
                    io.to(eachSocketId).emit("newMessageNotification",{
                       
                    })
                })
            }
        }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function socketSendDefaultMessage(fetchedMessage:any,fetchedConversation:any){
            if(receiverSockets){
                receiverSockets.forEach(eachSocketId =>{
                    io.to(eachSocketId).emit("socketSendDefaultMessage",{
                        message:fetchedMessage,
                        conversation:fetchedConversation
                    })
                    io.to(eachSocketId).emit("newMessageNotification",{
                       
                    })
                })
            }
        }
        

        if(startOfConversation){
            socketSendFirstMessage(fetchedMessage,fetchedConversation)
            
            res.status(200).json({firstMessageCheck:true, fetchedConversation:fetchedConversation,fetchedMessage:fetchedMessage,messageTemporaryId:messageTemporaryId})
        }
        else{
            socketSendDefaultMessage(fetchedMessage,fetchedConversation)
            res.status(200).json({fetchedConversation:fetchedConversation, fetchedMessage:fetchedMessage,messageTemporaryId:messageTemporaryId})
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





