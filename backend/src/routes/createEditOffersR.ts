import express from "express"
import * as CreateOffersController from "../controllers/createEditOffersC"

const router = express.Router();

router.delete("/deleteOffer",CreateOffersController.deleteOffer)

router.post("/createOffer", CreateOffersController.createOffer)

router.patch("/editOffer",CreateOffersController.editOffer)


export default router
