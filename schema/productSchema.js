import mongoose from "mongoose";
import { URL_FOR_IMAGE } from "../config";

const product = new mongoose.Schema({
    id: Number,
    name: String,
    company: String,
    price: Number,
    colors: [String],
    description: String,
    category: String,
    featured: Boolean,
    stock: Number,
    reviews: Number,
    stars: Number,
    images: {
        type: [{
            url: { type: String },
            filename: { type: String },
            type: { type: String },
            size: { type: Number }
        }],
        get: (images) => {
            const img = images.map((ele) => {
                const obj = {
                    url: `${URL_FOR_IMAGE}/${ele.url}`,
                    filename: ele.filename,
                    type: ele.type,
                    size: ele.size
                }
                return obj
            })

            return img
        }
    }
}, { toJSON: { getters: true } })
export default mongoose.model("Product", product)