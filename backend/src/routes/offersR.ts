import express from "express"
import * as OffersController from "../controllers/offersC"

const router = express.Router();

router.get("/getOffer", OffersController.getOffer);

router.get("/categoryName/serviceName", OffersController.getOffers); 

router.get("/getOffersForManageOffers", OffersController.getOffersForManageOffers);

router.get("/getOffersForUserProfile", OffersController.getOffersForUserProfile);

router.post("/createSoldOffer", OffersController.createSoldOffer);

router.get("/fetchSoldOffers", OffersController.fetchSoldOffers); 
router.get("/fetchBoughtOffers", OffersController.fetchBoughtOffers); 

router.get("/fetchSoldOfferById", OffersController.fetchSoldOfferById) //transactionPage için  
router.get("/setSeenAllTrue", OffersController.setSeenAllTrue);

router.delete("/deleteAllBoughtOffers", OffersController.deleteAllBoughtOffers); 



//aynı fetch methodu ile aynı sayıda url parametreli router yazarsan, üsttekini kullanır ve alttakine ilerlemez
// router.get("/getUser", OffersController.getOffer)  yazarsan, getOffer üstte old için getUser çalışmaz. post(getUser) olsa çalışırdı
// DÜZELTME --> /:getOffer olsaydı üsttekini kullanırdı sanırım, ":" olmadan ikisini de ayrı ayrı çalıştırır

export default router
