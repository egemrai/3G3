import express from "express"
import * as chatController from "../controllers/chatC"

const router= express.Router()


router.get("/fetchAllConversations/", chatController.fetchAllConversations)
router.get("/setSeenByReceiverTrue/", chatController.setSeenByReceiverTrue)


router.post("/sendMessage/", chatController.sendMessage)


router.delete("/deleteAllConversationsAndMessages/", chatController.deleteAllConversationsAndMessages)
// router.post("/logout/", chatController.logout)

export default router