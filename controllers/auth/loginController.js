import Joi from "joi";
import customErrorHandler from "../../services/customErrorHandler";
import { User, refreshToken } from "../../schema";
import tokenService from "../../services/token";
import bcrypt from "bcrypt"
import { REFRESH_SECRET } from "../../config";

const loginController={
    async login(req,res,next){
        const {email,password}=req.body;
        const loginSchema=Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        })
        const {error}=loginSchema.validate(req.body);
        if(error){
            return next(error)
        }

        try {
            const user=await User.findOne({email});
            if(!user){
                return next(customErrorHandler.wrontCredential())
            }
            const isValid=await bcrypt.compare(password,user.password);
            if(!isValid){
                return next(customErrorHandler.wrontCredential())
            }
            const access_token=tokenService.sign({id:user._id})
            const refresh_token=tokenService.sign({id:user._id},"1y",REFRESH_SECRET)
            await refreshToken.create({token:refresh_token})
            res.json({
                access_token,
                refresh_token
            })
        } catch (error) {
            return next(error)
        }
    },


    // for logout
    async logout(req,res,next){
        const refreshSchema=Joi.object({
            refresh_token:Joi.string().required()
        })
        console.log(req.body)
        const {error}=refreshSchema.validate(req.body)
        if(error){
            return next(error)
        }
        try {
            await refreshToken.deleteOne({token:req.body.refresh_token})
        } catch (error) {
            return next(error)
        }
        res.json({status:1})
    }
}

export default loginController