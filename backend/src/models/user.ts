import { InferSchemaType, model, Schema } from "mongoose";


const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true, select: false},  //select false olunca find ile response ettiğinde,
    email: {type: String, required: true, select: false}                    //false olan değerler görünmüyor, görünmesi için,
},{timestamps: true})                                                       //findbyid(dummy).select("email").exec() yapmak lazım

type User = InferSchemaType<typeof userSchema>

export default model<User>("User", userSchema)