import Joi from "joi";
import customErrorHandler from "../../services/customErrorHandler";
import { User } from "../../schema";
import bcrypt from "bcrypt"
import tokenService from "../../services/token";
const registerController={
     async register(req,res,next){

        //validate request
        const schema = Joi.object({
            name: Joi.string().required().max(30).min(3),
            email: Joi.string().required().email(),
            password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            repeat_password: Joi.string().required().valid(Joi.ref('password'))
        })
        const {error}= schema.validate(req.body)
        if(error){
            return next(error)
        }
        //check if user already exists
        try {
            const exist = await User.exists({email:req.body.email})
        if(exist){
            return next(customErrorHandler.alreadyExist("this user is already exist"))

        }
        } catch (error) {
            return next(error)
        }

        const {name,email,password}=req.body
        //to register user if it is not exixt
        let result
        try {
            const hashpassword= await bcrypt.hash(password,10)
            console.log(hashpassword)
            const data=new User({
                name,
                email,
                password:hashpassword
            })
            result=await data.save()
            console.log(result)
        } catch (error) {
            return next(error)
        }
        res.json({msg:"hello from express"});

        const token=tokenService.sign({id:result._id})
        console.log(token)
    }
}
export default registerController