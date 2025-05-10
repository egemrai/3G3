import { InferSchemaType, Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    active: { type: Boolean, required: true }
}, {timestamps: false});

type Category = InferSchemaType<typeof categorySchema>;  //type yerine interface kullanmak daha avantajlı, fakat InferSchemaType sadece type ile çalışıyor.

export default model<Category>("Category", categorySchema);
