export interface Conversation{
    participants:string[]
    messages:string[]
    createdAt:string
    updatedAt:string
}

export interface Message{
    senderId:string
    receiverId:string
    message:string
    createdAt:string
    updatedAt:string
}