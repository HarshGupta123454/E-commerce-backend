import { Cart } from "../schema";
import customErrorHandler from "../services/customErrorHandler";
const add_to_cart = {
    async cart(req, res, next) {
        const data = req.body;
        const { id } = req.user;
        try {
            const cartUser = await Cart.findOne({ user_id: id });
            if (cartUser) {
                cartUser.products.push(data)
                await cartUser.save()
                res.status(200).json({ message: 'Product added to cart successfully' });
                return
            }
            const newUser = new Cart({
                user_id: id,
                products: [data]
            })
            const result = await newUser.save()
            console.log(result)
            res.status(200).json({ message: 'Product added to cart successfully' });

        } catch (error) {
            return next(customErrorHandler.cartError(error))
        }

    },
    async delete(req, res, next) {
        const { id } = req.user;
        const { product_id } = req.body;
        try {
            let userData = await Cart.findOne({ user_id: id })
            let products = userData.products.filter((ele) => ele.product_id != product_id);
            userData = {
                ...userData,
                products: products
            }
            await userData.save()

        } catch (error) {
            return next(customErrorHandler.cartError(error))
        }

    },
    async show(req, res, next) {
        const { id } = req.user;
        try {
            const data = await Cart.findOne({ user_id: id })
            if (data) {
                res.status(201).json(data)
                return
            }
            res.status(401).json({ message: 'No cart found' })
        } catch (error) {
            return next(customErrorHandler.cartError(error))
        }
    }
}

export default add_to_cart