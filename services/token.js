import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
class tokenService{
    static sign(payload,expire='1m',secret=SECRET_KEY){
        return jwt.sign(payload,secret,{expiresIn:expire})
    }
    static verify(token,secret=SECRET_KEY){
        return jwt.verify(token,secret)
    }
}

export default tokenService