import mongoose from "mongoose";
import { URL_FOR_IMAGE } from "../config";

const product=new mongoose.Schema({
    id:String,
    name:String,
    company:String,
    price:Number,
    colors:[String],
    description:String,
    category:String,
    featured:Boolean,
    stock:Number,
    reviews:Number,
    stars:Number,
    images:{
        type:[String],
        get:(images)=>{
            images=images.map((ele)=>{
                return `${URL_FOR_IMAGE}/${ele}`
            })
            return images
        }
    }
},{toJSON:{getters:true}})
export default mongoose.model("Product",product)