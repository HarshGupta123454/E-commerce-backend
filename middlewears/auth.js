import customErrorHandler from "../services/customErrorHandler"
import tokenService from "../services/token"

const auth = async (req, res, next) => {
    let authheader = req.headers.authorization
    if (!authheader) {
        return next(customErrorHandler.unAuthorized())
    }
    const token = authheader.split(" ")[1]
    console.log(token)
    try {
        const { email } = tokenService.verify(token)
        const user = {
            email
        }
        req.user = user
        next()
    } catch (error) {
        return next(customErrorHandler.unAuthorized())
    }
}
export default auth