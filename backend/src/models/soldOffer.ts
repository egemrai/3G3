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
    confirmedAt:{type:Date,default:Date.now,required: false},//confirmed olunca zamanı saklamak için, 14 günlük iade süresini tutmak için
    // ÖNEMLİ Date.now() KULLANMA, kullanırsan serverı açtığın zamanı hafızada tutuyor, yani backendde değişiklik yapıp ctrl s yaptıktan sonra server açıldığında 14:20 olsun, sonraki oluşan tüm elemanların confirmedAt default datası 14:20 oluyor, oluşturulduğu zaman olmuyor.
},{timestamps: true})                                                       

type soldOffer = InferSchemaType<typeof soldOfferSchema>
export default model<soldOffer>("SoldOffer", soldOfferSchema)

/* 
default: Date.now     // doğru ✅ — her belge oluşturulduğunda çalışır
default: Date.now()   // yanlış ❌ — schema tanımlandığı anda çağrılır
*/