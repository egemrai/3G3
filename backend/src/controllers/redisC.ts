import { RequestHandler } from "express"
// import { offerQueue } from "../jobs/queue/offer"
import redisQueueMap from "../utils/redisQueueMap"
import createHttpError from "http-errors"
import logger from "../logger"

interface getDLQJobsBody{
    queueName: string
}
export const getDLQJobs:RequestHandler<unknown,unknown,getDLQJobsBody,unknown> = async (req,res,next)=>{
    try {
        const queueName = req.body.queueName
        const queue = redisQueueMap[queueName]

        if(!queue) throw createHttpError(500, 'getDLQJobs queue error')

        const failedJobs = await queue.getFailed()

        failedJobs.forEach(job => {
            logger.info({
                id: job.id,
                name: job.name,
                data: job.data,
                reason: job.failedReason,
                attemptsMade: job.attemptsMade
            })
        })

        res.send(true)


    } catch (error) {
        next(error)
    }
}