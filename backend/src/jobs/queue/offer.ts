import { Queue } from "bullmq"
import { bullRedisConnection } from "../../redis/bullmq"


export const offerQueue = new Queue('offer-queue',{
    connection: bullRedisConnection
})