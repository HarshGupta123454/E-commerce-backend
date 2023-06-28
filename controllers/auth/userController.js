import { User } from "../../schema"
import customErrorHandler from "../../services/customErrorHandler"
const userController = {
    async me(req, res, next) {
        try {
            let user = await User.findOne({ email: req.user.email }).select("-password -updatedAt -__v")
            if (!user) {
                return next(customErrorHandler.notFound())
            }
            res.json({ name: user.name, isAuthenticated: true })
        } catch (error) {
            return next(error)
        }
    }
}

export default userController