import nodemailer from "nodemailer"
import { EMAIL, PASSWORD } from "../config";
export const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});