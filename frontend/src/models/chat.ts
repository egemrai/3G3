import { User } from "./user"

export interface Conversation{  //populate kullandığım için type'ı bu şekilde vermem gerekiyor
    participants:User[]
    messages:Message[]
    createdAt:string
    updatedAt:string
    _id:string
}

export interface Message{
    senderId:User
    receiverId:User
    message:string
    createdAt:string
    updatedAt:string
    seenByReceiver:boolean
    sent:boolean
}