import mongoose from "mongoose";
const cart = new mongoose.Schema({
    user_id: String,
    products: [{
        product_id: Number,
        quantity: Number,
        price: Number,
        color: String
    }]

})

export default mongoose.model("Cart", cart)
