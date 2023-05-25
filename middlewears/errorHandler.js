import { DEBUG_MODE } from "../config"
import { ValidationError } from "joi"
import customErrorHandler from "../services/customErrorHandler"
const errorHandler=(err,req,res,next)=>{
    let statusCode=500
    let data={
        message:"internal server is error",
        ...(DEBUG_MODE && {originalError:err.message})
    }
    if(err instanceof ValidationError){
        statusCode=422
        data={
            message:err.message
        }
    }
    if(err instanceof customErrorHandler){
        statusCode=err.status
        message:err.message
    }
    return res.status(statusCode).json(data);
}
export default errorHandler