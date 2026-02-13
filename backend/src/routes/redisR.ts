import express from "express"
import * as RedisController from "../controllers/redisC"

const router = express.Router();

router.post("/getDLQJobs", RedisController.getDLQJobs)





export default router
