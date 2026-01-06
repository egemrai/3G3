import { RequestHandler } from "express"
import { randomUUID} from 'crypto'

const genReqId:RequestHandler = (req,res,next) =>{
    req.id = randomUUID();
    res.setHeader("x-request-id", req.id);
    next()
}

export default genReqId