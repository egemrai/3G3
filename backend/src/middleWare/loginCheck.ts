import { RequestHandler } from "express";
import createHttpError from "http-errors";


export const ifAuthenticated: RequestHandler = async (req, res, next) => {

    if(req.session.userId){
        next()
    }
    else{
        next(createHttpError(400, "User not authenticated"))
    }
}