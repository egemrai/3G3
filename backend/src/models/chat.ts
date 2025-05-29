import { InferSchemaType, Schema, model } from "mongoose";

const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId,ref:"User", required: true },
    receiverId: { type: Schema.Types.ObjectId,ref:"User", required: true },
    message: { type: String, required: true },
    seenByReceiver: { type: Boolean, default:false, required: true },
    sent: { type: Boolean, default:false, required: true },
}, {timestamps: true});

type Message = InferSchemaType<typeof messageSchema>;  //type yerine interface kullanmak daha avantajlı, fakat InferSchemaType sadece type ile çalışıyor.

export const Message =  model<Message>("Message", messageSchema);


const conversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId,ref:"User", required: true }],
    messages: [{ type: Schema.Types.ObjectId,ref:"Message", required: false }],
}, {timestamps: true});

type Conversation = InferSchemaType<typeof conversationSchema>;  //type yerine interface kullanmak daha avantajlı, fakat InferSchemaType sadece type ile çalışıyor.

export const Conversation= model<Conversation>("Conversation", conversationSchema);