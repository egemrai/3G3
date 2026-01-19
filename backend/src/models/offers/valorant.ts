import { InferSchemaType, model, Schema } from "mongoose";

//VALORANT SCHEMA
const valorantSchema = new Schema({
    categoryName: {type: String, required: true},
    serviceName: {type: String, required: true},
    sellerId:{type: Schema.Types.ObjectId, ref:'User', required: true},
    title: {type: String, required: true, select: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    currency: {type: String, required: true},
    active: {type: Boolean, required: true, default: true},  //default active eklemeyi unutma
},{ discriminatorKey: "serviceName", timestamps: true})                                                       

type Valorant = InferSchemaType<typeof valorantSchema>
export const ValorantModel = model<Valorant>("Valorant", valorantSchema)

//VALORANTACCOUNT SCHEMA
const ValorantAccountSchema = new Schema({
    // sellerId:{type: Schema.Types.ObjectId, required: true},
    server: {type: String, required: true},
    rank: {type: String, required: true},
    agents: {type: Number, required: true},
    skins: {type: Number, required: true},
    deliveryTime: {type: Number, required: true},
    stock: {type: Number, required: true},
},)                                                       

type ValorantAccount = InferSchemaType<typeof ValorantAccountSchema>
export const ValorantAccountModel= ValorantModel.discriminator<ValorantAccount & Valorant>("ValorantAccount", ValorantAccountSchema)

//VALORANTBOOST SCHEMA
const ValorantBoostSchema = new Schema({
    // sellerId:{type: Schema.Types.ObjectId, required: true},
    server: {type: String, required: true},
    desiredRank: {type: String, required: true},
    serviceType: {type: String, required: true, select: true},
    deliveryTime: {type: Number, required: true},
    stock: {type: Number, required: true},
    duration: {type: Number, required: true},
},)                                                       

type ValorantBoost = InferSchemaType<typeof ValorantBoostSchema>
export const ValorantBoostModel= ValorantModel.discriminator<ValorantBoost & Valorant>("ValorantBoost", ValorantBoostSchema)

//VALORANTCOACH SCHEMA
const ValorantCoachSchema = new Schema({
    // sellerId:{type: Schema.Types.ObjectId, required: true},
    server: {type: String, required: true},
    rank: {type: String, required: true},
    deliveryTime: {type: Number, required: true},
    stock: {type: Number, required: true},
    duration: {type: Number, required: true},
},)                                                       

type ValorantCoach = InferSchemaType<typeof ValorantCoachSchema>
export const ValorantCoachModel= ValorantModel.discriminator<ValorantCoach & Valorant>("ValorantCoach", ValorantCoachSchema)

//VALORANTVP SCHEMA
const ValorantVPSchema = new Schema({
    // sellerId:{type: Schema.Types.ObjectId, required: true},
    server: {type: String, required: true},
    deliveryTime: {type: Number, required: true},
    stock: {type: Number, required: true},
},)                                                       

type ValorantVP = InferSchemaType<typeof ValorantVPSchema>
export const ValorantVPModel= ValorantModel.discriminator<ValorantVP & Valorant>("ValorantVP", ValorantVPSchema)