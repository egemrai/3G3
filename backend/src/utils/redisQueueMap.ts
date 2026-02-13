import { Queue } from "bullmq"
import { offerQueue } from "../jobs/queue/offer"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const redisQueueMap : Record<string, Queue<any>> = {
    "offer": offerQueue,
    
}

export default redisQueueMap