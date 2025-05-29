import express from "express"
import * as userController from "../controllers/usersC"
import { ifAuthenticated } from "../middleWare/loginCheck"

const router= express.Router()

router.get("/", ifAuthenticated, userController.GetloggedInUser)

router.get("/fetchUsername", userController.fetchUsername)

router.get("/getloggedInUserId", userController.getloggedInUserId)
router.get("/fetchloggedInUser", userController.fetchloggedInUser)

router.get("/fetchUserIdByUsername", userController.fetchUserIdByUsername)

router.get("/fetchUser", userController.fetchUser)

router.get("/setUserOnline", userController.setUserOnline) //socket connect çalışınca kullanıcıyı online göstermek için
router.get("/setUserOffline", userController.setUserOffline) //socket disconnect çalışınca kullanıcıyı offline göstermek ve disconnect zamanını tutmak için

router.post("/signup/", userController.SignUp)

router.post("/login/", userController.login)

router.post("/logout/", userController.logout)

export default router