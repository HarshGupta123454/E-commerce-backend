import customErrorHandler from "../services/customErrorHandler"
import tokenService from "../services/token"

const auth=async(req,res,next)=>{
    let authheader=req.headers.authorization
    if(!authheader){
        console.log("header not found")
        return next(customErrorHandler.unAuthorized())
    }
    const token=authheader.split(" ")[1]
    try {
        const {id}=tokenService.verify(token)
        const user={
            id
        }
        req.user=user
        next()
    } catch (error) {
        console.log("error")
        return next(customErrorHandler.unAuthorized())
    }
}
export default auth