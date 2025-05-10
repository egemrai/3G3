import express from "express"
import * as CreateOffersController from "../controllers/createEditOffersC"

const router = express.Router();

router.delete("/deleteOffer",CreateOffersController.deleteOffer)

router.post("/createLolAccount", CreateOffersController.createLolAccountOffer);
router.patch("/editLolAccount",CreateOffersController.editLolAccountOffer)
router.post("/createLolBoost", CreateOffersController.createLolBoostOffer);
router.patch("/editLolBoost",CreateOffersController.editLolBoostOffer)
router.post("/createLolCoach", CreateOffersController.createLolCoachOffer);
router.patch("/editLolCoach",CreateOffersController.editLolCoachOffer)
router.post("/createLolRP", CreateOffersController.createLolRPOffer);
router.patch("/editLolRP",CreateOffersController.editLolRPOffer)

router.post("/createValorantAccount", CreateOffersController.createValorantAccountOffer)
router.patch("/editValorantAccount", CreateOffersController.editValorantAccountOffer)
router.post("/createValorantBoost", CreateOffersController.createValorantBoostOffer)
router.patch("/editValorantBoost", CreateOffersController.editValorantBoostOffer)
router.post("/createValorantCoach", CreateOffersController.createValorantCoachOffer)
router.patch("/editValorantCoach", CreateOffersController.editValorantCoachOffer)
router.post("/createValorantVP", CreateOffersController.createValorantVPOffer)
router.patch("/editValorantVP", CreateOffersController.editValorantVPOffer)

export default router
