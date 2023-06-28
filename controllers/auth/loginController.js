import Joi from "joi";
import customErrorHandler from "../../services/customErrorHandler";
import { User, refreshToken } from "../../schema";
import tokenService from "../../services/token";
import bcrypt from "bcrypt"
import { transporter } from "../../services/email"
import generateOTP from "../../services/otpgenrator";
const loginController = {
    /**to login the user */
    async login(req, res, next) {
        const { email, password } = req.body;
        const loginSchema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return next(error)
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return next(customErrorHandler.wrontCredential())
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return next(customErrorHandler.wrontCredential())
            }
            const authToken = tokenService.sign({ email }, "1y")
            res.json({
                authToken,
                msg: "login successfully"
            })
        } catch (error) {
            return next(error)
        }
    },


    /** to logout the user*/
    async logout(req, res, next) {
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        console.log(req.body)
        const { error } = refreshSchema.validate(req.body)
        if (error) {
            return next(error)
        }
        try {
            await refreshToken.deleteOne({ token: req.body.refresh_token })
        } catch (error) {
            return next(error)
        }
        res.json({ status: 1 })
    },

    /**to reset the user account */
    async reset(req, res, next) {
        const { email } = req.body;
        const loginSchema = Joi.object({
            email: Joi.string().required()
        })
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return next(error)
        }
        const otp = generateOTP()
        var option = {
            from: "",
            to: email,
            subject: "OTP verification",
            text: `your otp for verification is ${otp}`
        }
        transporter.sendMail(option, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Send successfully");
            }
        })
        return res.json({ msg: "send successful" })

    }
}

export default loginController