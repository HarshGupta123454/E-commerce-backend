import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    otp: { type: Number, unique: true, required: true },
    token: { type: String, unique: true, required: true },
    createdAt: {
        type: Date,
        expires: "5m",
        default: Date.now
    }
});

export default mongoose.model("Otp", Schema)