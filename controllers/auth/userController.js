import { User } from "../../schema"
import customErrorHandler from "../../services/customErrorHandler"
const userController={
    async me(req,res,next){
        try {
            console.log(req.user)
            const user = await User.findOne({_id:req.user.id}).select("-password -updatedAt -__v")
            if(!user){
                return next(customErrorHandler.notFound())
            }
            res.json(user)
        } catch (error) {
            return next(error)
        }
    }
}

export default userController