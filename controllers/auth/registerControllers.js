import Joi from "joi";
import customErrorHandler from "../../services/customErrorHandler";
import { OTP, Tempuser, User, refreshToken } from "../../schema";
import bcrypt from "bcrypt"
import tokenService from "../../services/token";
import nodemailer from "nodemailer"
import generateOTP from "../../services/otpgenrator";
import mongoose from "mongoose";
import { EMAIL, PASSWORD } from "../../config";
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});
const registerController = {
    async register(req, res, next) {

        //validate request
        const schema = Joi.object({
            name: Joi.string().required().max(30).min(3),
            email: Joi.string().required().email(),
            password: Joi.string().required()
        })
        const { error } = schema.validate(req.body)
        if (error) {
            return next(error)
        }
        //check if user already exists
        try {
            const exist = await User.exists({ email: req.body.email })
            if (exist) {
                return next(customErrorHandler.alreadyExist("this user is already exist"))

            }
        } catch (error) {
            return next(error)
        }

        const { name, email, password } = req.body
        //to register user if it is not exixt
        let result
        try {
            const hashpassword = await bcrypt.hash(password, 10)
            const data = new Tempuser({
                name,
                email,
                password: hashpassword
            })
            result = await data.save()
        } catch (error) {
            return next(error)
        }
        //to genrate the otp
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
                console.log("Send successfully", response.response);
            }
        })
        let otpToken
        try {
            otpToken = tokenService.sign({ email }, "5m")
            const tempuser = new OTP({
                email,
                otp,
                token: otpToken
            })
            const tempdata = await tempuser.save()
            console.log(tempdata)
        } catch (error) {
            console.log(error)
        }
        res.status(201).json({ msg: "otp send successfully", otpToken })
    },

    async opt(req, res, next) {
        const { otp } = req.body
        let authheader = req.headers.authorization
        if (!authheader) {
            console.log("header not found")
            return next(customErrorHandler.unAuthorized())
        }
        const token = authheader.split(" ")[1]
        let data
        try {
            const { email } = tokenService.verify(token)
            data = await OTP.findOne({ email })
        } catch (error) {
            return next(customErrorHandler.unAuthorized("register again"))
        }
        let authToken
        if (data) {
            if (data.otp === otp) {
                const user = await Tempuser.findOne({ email: data.email }).select("name email password -_id")
                try {
                    if (user) {
                        var saveUser = new User(user)
                        saveUser._id = mongoose.Types.ObjectId();
                        saveUser.isNew = true
                        const result = await saveUser.save()
                        await Tempuser.deleteOne({ email: user.email })
                        authToken = tokenService.sign({ email: user.email }, "1d")
                        const token = new refreshToken({ token: authToken })
                        await token.save()
                    }
                } catch (error) {
                    next(customErrorHandler.unAuthorized("again register"))
                    console.log(error)
                }
            } else {
                next(customErrorHandler.wrontCredential("worng otp"))
            }
        }

        res.json({ msg: "register successfully", authToken })
    }
}
export default registerController