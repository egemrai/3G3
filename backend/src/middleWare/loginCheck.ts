import { RequestHandler } from "express";
import createHttpError from "http-errors";


export const ifAuthenticated: RequestHandler = async (req, res, next) => {
    console.log("ifAuthenticated girdi")
    console.log("req.session validate:",req.session )
    console.log("Session ID validate:", req.sessionID)
    if(req.session.userId){
        next()
    }
    else{
        next(createHttpError(400, "User not authenticated"))
    }
}