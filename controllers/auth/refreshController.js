import { refreshToken } from "../../schema";
import customErrorHandler from "../../services/customErrorHandler";
import tokenService from "../../services/token";
import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
const refreshController={
    async refresh(req,res,next){
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        let refreshtoken
        try {
            refreshtoken = await refreshToken.findOne({token:req.body.refresh_token})
            console.log(refreshtoken)
            if(!refreshtoken){
                return next(customErrorHandler.unauthorised("invalid refresh token"))
            }

            const {id}=await tokenService.verify(refreshtoken.token,REFRESH_SECRET)
            const accessToken = await tokenService.sign({id})
            res.json({accessToken})
        } catch (error) {
            console.log("error is here")
            return next(error)
        }
    }
}

export default refreshController