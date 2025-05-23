import { InferSchemaType, Schema, model } from "mongoose";

const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId,ref:"User", required: true },
    receiverId: { type: Schema.Types.ObjectId,ref:"User", required: true },
    message: { type: String,ref:"User", required: true },
}, {timestamps: true});

type Message = InferSchemaType<typeof messageSchema>;  //type yerine interface kullanmak daha avantajlı, fakat InferSchemaType sadece type ile çalışıyor.

export const Message =  model<Message>("Message", messageSchema);


const conversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId,ref:"User", required: true }],
    messages: [{ type: Schema.Types.ObjectId,ref:"Message", required: true }],
}, {timestamps: true});

type Conversation = InferSchemaType<typeof conversationSchema>;  //type yerine interface kullanmak daha avantajlı, fakat InferSchemaType sadece type ile çalışıyor.

export const Conversation= model<Conversation>("Conversation", conversationSchema);