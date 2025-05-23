import { RequestHandler } from "express";
import { Conversation as ConversationModel,Message as MessageModel } from "../models/chat";
import createHttpError from "http-errors";


export const getCategories:RequestHandler= async (req, res, next) => {
    const an = req.session.userId
    try {
        if(!an){
            throw createHttpError(400,"ege")
        } 
        
        const allCategories = await ConversationModel.find({active: true}).exec()
        const allCategories2 = await MessageModel.find({active: true}).exec()
        console.log(allCategories2)

        res.status(200).json(allCategories)
    } catch (error) {
        next(error)
    }
}






