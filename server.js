import express from "express";
import { APP_PORT,MONGO_URL} from "./config";
import routes from "./routes";
import errorHandler from "./middlewears/errorHandler";
import connect from "./connection";
import cors from "cors"
const app=express()
app.use(cors())
app.use(express.json())
app.use("/api",routes)
app.use(errorHandler)
app.use(express.urlencoded({ extended: false }));
app.use("/uploads",express.static("uploads/"))
const start=async()=>{
    try {
        connect(MONGO_URL)
        app.listen(APP_PORT,()=>{
            console.log(`listening to the port ${APP_PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()
