import { InferSchemaType, model, Schema } from "mongoose";


const soldOfferSchema = new Schema({
    categoryName: {type: String, required: true},
    serviceName: {type: String, required: true},
    sellerId:{type: Schema.Types.ObjectId, required: true},
    buyerId:{type: Schema.Types.ObjectId, required: true},
    quantity:{type: Number, required: true},
    currency:{type: String, required: true},
    description:{type: String, required: true},
    unitPrice:{type: Number, required: true},
    totalAmount:{type: Number, required: true},
    title:{type: String, required: true},
    sellerRating:{type: String,default: "positive", required: true}, //alıcının satıcıya verdiği puan
    sellerComment:{type: String,default: "", required: false}, //alıcının satıcıya yaptığı yorum
    sellerEditedRating:{type: Boolean,default: false, required: true}, //satıcının yorumunu editleyip editlemediği
    buyerRating:{type: String,default: "positive", required: true},
    buyerComment:{type: String,default: "", required: false},
    buyerEditedRating:{type: Boolean,default: false, required: true},
    stage:{type: String,default: "pending", required: true},
    seenBySeller:{type: Boolean,default: false, required: true},
    seenByBuyer:{type: Boolean,default: true, required: true},
    offerDetails:{type: Schema.Types.Mixed, required: true},
    offerCredentials:[{type: Schema.Types.Mixed, required: true}],  //array içinde yapmayı deniyorum
},{timestamps: true})                                                       

type soldOffer = InferSchemaType<typeof soldOfferSchema>
export default model<soldOffer>("SoldOffer", soldOfferSchema)