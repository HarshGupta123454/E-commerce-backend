import mongoose from "mongoose";
const connect = (url) => {
    mongoose.connect(url).then((res) => console.log("connection successfull")).catch((err) => console.log("error occour in the connection"))
}

export default connect