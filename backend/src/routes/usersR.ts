import express from "express"
import * as userController from "../controllers/usersC"
import { ifAuthenticated } from "../middleWare/loginCheck"

const router= express.Router()

router.get("/", ifAuthenticated, userController.GetloggedInUser)

router.get("/fetchUsername", userController.fetchUsername)

router.get("/getloggedInUserId", userController.getloggedInUserId)

router.post("/signup/", userController.SignUp)

router.post("/login/", userController.login)

router.post("/logout/", userController.logout)

export default router