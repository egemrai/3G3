import express from "express"
import * as chatController from "../controllers/chatC"

const router= express.Router()


router.get("/logout/", chatController.getCategories)

// router.post("/logout/", chatController.logout)

export default router