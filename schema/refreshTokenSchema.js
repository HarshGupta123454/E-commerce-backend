import mongoose from "mongoose";

const refreshSchema = new mongoose.Schema({
    token: { type: String, required: true }
})

export default mongoose.model("Token", refreshSchema)