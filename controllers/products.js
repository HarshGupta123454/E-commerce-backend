import multer from "multer";
import { Product } from "../schema";
import path from "path"
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads"),
    filename: (req, file, cb) => {
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
        cb(null, uniquename)
    }
})

const handelMultipart = multer({
    storage,
    limits: { fileSize: 1000000 * 5 }
}).array("image")


const productController = {
    async store(req, res, next) {
        handelMultipart(req, res, async (err) => {
            if (err) {
                console.log("error")
                return next(err)
            }
            try {
                const images = req.files.map((ele) => {
                    return ele.path.replace(/\\/g, "/")
                })
                let data = req.body
                let colors = JSON.parse(req.body.colors)
                data = {
                    ...data,
                    colors,
                    images

                }
                console.log(data)
                // const product = new Product(data)
                // const result=await product.save()
                // return res.status(201).json(result)

                res.send(req.body)
            } catch (error) {
                console.log("erro array m g")
                return next(error)
            }
        })
    },
    async display(req, res, next) {
        try {
            const data = await Product.find()
            res.json(data)
        } catch (error) {

        }
    }
}


export default productController