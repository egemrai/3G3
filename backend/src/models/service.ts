import { InferSchemaType, Schema, model } from "mongoose";

const serviceSchema = new Schema({
    categoryName: { type: String, required: true },
    active: { type: Boolean, required: true },
    serviceName: { type: String, required: true }
}, {timestamps: false});

type Service = InferSchemaType<typeof serviceSchema>;  //type yerine interface kullanmak daha avantajlı, fakat InferSchemaType sadece type ile çalışıyor.

export default model<Service>("Service", serviceSchema);
