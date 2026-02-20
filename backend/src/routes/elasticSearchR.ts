
import express from "express";
import * as elasticSearchController from "../controllers/elasticSearchC"

const router =  express.Router()

// ES ayakta mı? Basic ping + cluster info

router.get('/ping',elasticSearchController.elasticSearchPingTest)

router.post('/bulkIndexOffers',elasticSearchController.bulkIndexOffers)

router.post('/elasticSearchDeleteOffer',elasticSearchController.elasticSearchDeleteOffer)

router.get('/getElasticSearchOffersCount',elasticSearchController.getElasticSearchOffersCount)

router.get('/getElasticSearchAllOffers',elasticSearchController.getElasticSearchAllOffers)

router.get('/getOffersViaElasticSearch',elasticSearchController.getOffersViaElasticSearch)

export default router