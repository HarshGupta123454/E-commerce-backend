import mongoose from "mongoose";

const refreshSchema=new mongoose.Schema({
    token:String
})

export default mongoose.model("Token",refreshSchema)