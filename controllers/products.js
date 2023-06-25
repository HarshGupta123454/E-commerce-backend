import multer from "multer";
import { Product } from "../schema";
import path from "path"
import fs from "fs"
import customErrorHandler from "../services/customErrorHandler";
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
            let images = [];
            if (err) {
                images.map((ele) => {
                    fs.unlink(ele.url)
                })
                console.log("error")
                return next(err)
            }
            try {
                req.files.map((ele) => {
                    images = [...images, {
                        url: ele.path.replace(/\\/g, "/"),
                        filename: ele.originalname,
                        type: ele.mimetype,
                        size: ele.size
                    }]
                })
                let data = req.body
                let colors = JSON.parse(req.body.colors)
                data = {
                    ...data,
                    colors,
                    images

                }
                console.log(data)
                const product = new Product(data)
                const result = await product.save()
                return res.status(201).json(result)

            } catch (error) {
                images.map((ele) => {
                    fs.unlink(ele.url, (err) => {
                        if (err) {
                            console.log(err)
                            return next(err)
                        }
                    })
                })
                return next(error)
            }
        })
    },
    async display(req, res, next) {
        try {
            let data = await Product.find().select("-stock -reviews -stars")
            let changeData = data.map((ele) => {
                const { id, name, price, colors, description, category, featured, company } = ele
                const image = ele.images[0].url;

                return {
                    id,
                    name,
                    price,
                    colors,
                    image,
                    company,
                    description,
                    category,
                    featured
                }
            })
            res.json(changeData)
        } catch (error) {
            return next(error)
        }
    },
    async show(req, res, next) {
        let document;
        try {
            document = await Product.findOne({ id: req.params.id }).select("-__v -_id")
        } catch (error) {
            return next(customErrorHandler.serviceError())
        }
        return res.json(document)
    }
}


export default productController