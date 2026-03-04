import { RequestHandler } from "express"
import { redisClient as redis} from "../redis/client"

const rateLimitDefault:RequestHandler = async(req,res,next) =>{
    const key = req.session.userId 
                ? `request:user:${req.session.userId}`
                : `request:ip:${req.ip}`
    const attempts = await redis.incr(key)
    if(attempts === 1){
        await redis.expire(key, 1000)
    }
    if(attempts >20){
        res.status(429).json({
            error: "Too many attempts"
        })
        return
    }
    next()
}

export default rateLimitDefault