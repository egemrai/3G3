import { RequestHandler } from "express";
import CategoryModel from "../models/category"
import ServiceModel from "../models/service"
import createHttpError from "http-errors";

export const getCategories:RequestHandler= async (req, res, next) => {
    try {
        const allCategories = await CategoryModel.find({active: true}).exec()
        console.log("req.session:",req.session ) //session userid check
        res.status(200).json(allCategories)
    } catch (error) {
        next(error)
    }
}



interface getServicesParam{
    categoryName: string
}
export const getServices: RequestHandler<getServicesParam, unknown, unknown, unknown> = async (req, res, next) => {
    const categoryName= req.params.categoryName // categoryName 2 kelime olursa aradaki %20 kendiliğinden ignorelanıyor

    //const testGameName= req.query //rep query testi, gameName yerine bunu yazınca ?testGameName değeri urlde neye eşitse o dönüyor
    try {
        if(!categoryName){
                    throw createHttpError(400, "Service seçmek için categoryName yok");
                }
        const services= await ServiceModel.find({active: true, categoryName:{$regex:categoryName, $options: "i"}})  //exec() yok ve çalışıyor araştır
        
        res.status(200).json(services)
    } catch (error) {
        next(error)
    }
}


