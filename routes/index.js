import express from "express";
const router = express.Router()
import { registerController } from "../controllers";
import loginController from "../controllers/auth/loginController";
import auth from "../middlewears/auth";
import userController from "../controllers/auth/userController";
import refreshController from "../controllers/auth/refreshController";
import productController from "../controllers/products";
import add_to_cart from "../controllers/add-to-cart";
router.post("/register", registerController.register)
router.post("/login", loginController.login)
router.get("/me", auth, userController.me)
router.post("/refresh", refreshController.refresh)
router.post("/logout", loginController.logout)

//for getting the products details for our website
router.post("/product", productController.store)
router.get("/product", productController.display)
router.get("/product/:id", productController.show)

// for cart
router.post("/cart", auth, add_to_cart.cart)
router.delete("/cart", auth, add_to_cart.delete)
router.get("/cart", auth, add_to_cart.show)
export default router