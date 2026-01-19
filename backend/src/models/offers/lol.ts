import { InferSchemaType, model, Schema } from "mongoose";

//LOL SCHEMA
const lolSchema = new Schema({
    categoryName: {type: String, required: true},
    serviceName: {type: String, required: true},
    sellerId:{type: Schema.Types.ObjectId, ref:'User', required: true},
    title: {type: String, required: true, select: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    currency: {type: String, required: true},
    active: {type: Boolean, required: true, default: true},
},{ discriminatorKey: "serviceName", timestamps: true})                                                       

type Lol = InferSchemaType<typeof lolSchema>
export const LolModel= model<Lol>("Lol", lolSchema)

//LOLACCOUNT SCHEMA
const lolAccountSchema = new Schema({
    // sellerId:{type: Schema.Types.ObjectId, required: true},
    server: {type: String, required: true},
    rank: {type: String, required: true},
    champions: {type: Number, required: true},
    skins: {type: Number, required: true},
    deliveryTime: {type: Number, required: true},
    stock: {type: Number, required: true},
     //default active eklemeyi unutma
},)                                                       

type LolAccount = InferSchemaType<typeof lolAccountSchema>
export const LolAccountModel= LolModel.discriminator<LolAccount & Lol>("LolAccount", lolAccountSchema)

//LOLBOOST SCHEMA
const lolBoostSchema = new Schema({
    // sellerId:{type: Schema.Types.ObjectId, required: true},
    server: {type: String, required: true},
    desiredRank: {type: String, required: true},
    serviceType: {type: String, required: true, select: true},
    deliveryTime: {type: Number, required: true},
    stock: {type: Number, required: true},
    duration: {type: Number, required: true},
},)                                                       

type LolBoost = InferSchemaType<typeof lolBoostSchema>
export const LolBoostModel= LolModel.discriminator<LolBoost & Lol>("LolBoost", lolBoostSchema)

//LOLCOACH SCHEMA
const lolCoachSchema = new Schema({
    // sellerId:{type: Schema.Types.ObjectId, required: true},
    server: {type: String, required: true},
    rank: {type: String, required: true},
    deliveryTime: {type: Number, required: true},
    stock: {type: Number, required: true},
    duration: {type: Number, required: true},
},)                                                       

type LolCoach = InferSchemaType<typeof lolCoachSchema>
export const LolCoachModel= LolModel.discriminator<LolCoach & Lol>("LolCoach", lolCoachSchema)

//LOLRP SCHEMA
const lolRPSchema = new Schema({
    // sellerId:{type: Schema.Types.ObjectId, required: true},
    server: {type: String, required: true},
    deliveryTime: {type: Number, required: true},
    stock: {type: Number, required: true},
    description: {type: String, required: true},
},)                                                       

type LolRP = InferSchemaType<typeof lolRPSchema>
export const LolRPModel= LolModel.discriminator<LolRP & Lol>("LolRP", lolRPSchema)