import { RequestHandler } from "express";
import createHttpError from "http-errors";


export const ifAuthenticated: RequestHandler = async (req, res, next) => {
    console.log("ifAuthenticated girdi")
    console.log("req.session ifAuthenticated:",req.session )

    if(req.session.userId){
        next()
    }
    else{
        next(createHttpError(400, "User not authenticated"))
    }
}