import { RequestHandler } from "express";
import createHttpError from "http-errors";
// import * as LolOfferModels from "../models/offers/lol"
// import * as ValorantOfferModels from "../models/offers/valorant"
// import { Model } from "mongoose";
import logger from "../logger";
import { offerQueue } from "../jobs/queue/offer";
import offerModelMap from "../utils/offerModelMap";


// // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const offerModelMap : Record<string, Model<any>> = {
//         "LolAccount": LolOfferModels.LolAccountModel,
//         "LolBoost": LolOfferModels.LolBoostModel,
//         "LolRP": LolOfferModels.LolRPModel,
//         "LolCoach": LolOfferModels.LolCoachModel,
//         "ValorantAccount": ValorantOfferModels.ValorantAccountModel,
//         "ValorantBoost": ValorantOfferModels.ValorantBoostModel,
//         "ValorantVP": ValorantOfferModels.ValorantVPModel,
//         "ValorantCoach": ValorantOfferModels.ValorantCoachModel,
//     }

/*---------------------------DeleteOffer---------------------------------*/
interface deleteOfferURLQUery{
    _id: string,
    sellerId: string,
    serviceName: string,
}

export const deleteOffer: RequestHandler<unknown,unknown,unknown,deleteOfferURLQUery> = async (req,res,next) => {
    const userId= req.session.userId
    const {serviceName, _id, sellerId} = req.query
    
    
    const SelectedModel = offerModelMap[serviceName];

    try {
        if (!SelectedModel) {
            throw createHttpError(400, `incorrent serviceName: ${serviceName}`);
        }

        if(userId?.toString()!==sellerId){
            throw createHttpError(404, "user can't access this offer")
        }
        const offer = await SelectedModel.findById(_id).exec()

        if(!offer){
            throw createHttpError(404,"offer doesn't exist")
        }

        await offer.deleteOne()

        //DELETE ES OFFER QUEUE EKLEME KISMI
        await offerQueue.add('deleteOfferForES',{
            offerId: _id.toString()
        },{
            attempts: 3,              // 3 deneme
            backoff: {
                type: "exponential",  // delayi 2 ile çarpıyor, 4 -> 8 ->16 
                delay: 4000,               
            },
        })

        res.sendStatus(204)

    } catch (error) {
        next(error)
    }
    
}

/*--------------------------CreateGenericOffer-----------------------------*/
export const createOffer:RequestHandler = async(req,res,next)=>{
    const userId = req.session.userId
    const offerCredentials = req.body
    const {categoryName,serviceName,...restOfOfferCredentials} = offerCredentials
    const serviceNameForMongo = categoryName.concat(serviceName)
    try {
        if(!categoryName && !serviceName && !userId) 
            throw createHttpError(500,'createOffer missing credentials')
        const offerCredentialsForMongo = {...restOfOfferCredentials}
        offerCredentialsForMongo.categoryName = categoryName
        offerCredentialsForMongo.serviceName = serviceNameForMongo
        offerCredentialsForMongo.sellerId = userId

        const selectedModel = offerModelMap[serviceNameForMongo]
        if(!selectedModel) 
            throw createHttpError(500,'createOffer missing selectedModel')
        
        const createdOffer = await selectedModel.create(offerCredentialsForMongo)

        //CREATE ES OFFER QUEUE EKLEME KISMI
        await offerQueue.add('createOfferForES',{
            offerId: createdOffer._id.toString(),
            offerServiceName: serviceNameForMongo
        },{
            attempts: 3,              // 3 deneme
            backoff: {
                type: "exponential",  // delayi 2 ile çarpıyor, 4 -> 8 ->16 
                delay: 4000,               
            },
        })

        
        res.status(200).json(createdOffer)
    } catch (error) {
        next(error)
    }
}

/*--------------------------EditGenericOffer-----------------------------*/
interface EditOfferBody{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    credentials: Record<string,any>,
    editIdData:{
        _id: string,
        sellerId: string,
    }
}

export const editOffer:RequestHandler<unknown,unknown,EditOfferBody,unknown> = async(req,res,next)=>{
    const userId = req.session.userId
    const offerCredentials = req.body.credentials
    const {_id:offerId,sellerId} = req.body.editIdData

    const {categoryName,serviceName,...restOfOfferCredentials} = offerCredentials
    const serviceNameForMongo = categoryName.concat(serviceName)
    try {
        if(!categoryName && !serviceName && !userId) 
            throw createHttpError(500,'editOffer missing credentials')
        if(userId!.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const selectedModel = offerModelMap[serviceNameForMongo]
        if(!selectedModel){
            throw createHttpError(500,'createOffer missing selectedModel')
        }

        const offer = await selectedModel.findById(offerId).exec()

        
        logger.debug({categoryName},'categoryName')
        logger.debug({serviceName},'serviceName')
        logger.debug({restOfOfferCredentials},'restOfOfferCredentials')
        logger.debug({userId},'userId')
        logger.debug({sellerId},'sellerId')
        logger.debug({offerId},'offerId')

        Object.entries(restOfOfferCredentials).forEach(([key,value])=>{
            offer[key] = value
        })
        
        const updatedLolAccountOffer = await offer.save()

        //EDIT ES OFFER QUEUE EKLEME KISMI  (overwrite ediyorum direkt offerı o yüzden create ile aynı)
        await offerQueue.add('editOfferForES',{
            offerId: offerId.toString(),
            offerServiceName: serviceNameForMongo
        },{
            attempts: 3,              // 3 deneme
            backoff: {
                type: "exponential",  // delayi 2 ile çarpıyor, 4 -> 8 ->16 
                delay: 4000,               
            },
        })

        res.status(200).json(updatedLolAccountOffer)

    } catch (error) {
        next(error)
    }
}






// /*--------------------------createLolBoost-----------------------------*/

// interface LolBoostBody{
//     server: string,
//     desiredRank: string,
//     title: string,
//     description: string,
//     price: number,
//     currency: string,
//     deliveryTime: number,
//     stock: number,
//     duration: number,
//     serviceType: string,
// }

// export const createLolBoostOffer:RequestHandler<unknown,unknown,LolBoostBody,unknown> = async(req, res, next)=>{
//     const {server,desiredRank,title,description,price,currency,deliveryTime,stock,duration,serviceType} = req.body
//     const userId = req.session.userId

//     try {
//         if(!server || !desiredRank || !title || !description || !price || !currency || !deliveryTime || !stock || !duration || !serviceType){
//             throw createHttpError(400,"LolBoostCredentials missing")
//         }
        
//         if(!userId){
//             throw createHttpError(400,"userId(seller) missing")
//         } 

//         const newLolBoost= await LolOfferModels.LolBoostModel.create({
//             sellerId: userId,
//             categoryName: "Lol",
//             serviceName: "LolBoost",
//             server: server,
//             desiredRank: desiredRank,
//             title: title,
//             description: description,
//             price: price,
//             currency: currency,
//             deliveryTime: deliveryTime,
//             stock: stock,
//             duration: duration,
//             serviceType: serviceType,
//         })

//         res.status(200).json(newLolBoost)

//     } catch (error) {
//         next(error)
//     }

// }

// /*--------------------------editLolBoost-----------------------------*/
// interface LolBoostEditBody{
//     credentials:{
//         server: string,
//         desiredRank: string,
//         title: string,
//         description: string,
//         price: number,
//         currency: string,
//         deliveryTime: number,
//         stock: number,
//         duration: number,
//         serviceType: string,
//     },
//     editIdData:{
//         _id: string,
//         sellerId: string,
//     }
// }
// export const editLolBoostOffer:RequestHandler<unknown,unknown,LolBoostEditBody,unknown> = async(req,res,next) =>{
//     const {server,desiredRank,title,description,price,currency,deliveryTime,stock,duration,serviceType} = req.body.credentials
//     const {_id,sellerId} = req.body.editIdData
//     const userId = req.session.userId

//     try {
//         if(!userId){
//             throw createHttpError(404, "session userId missing")
//         }

//         if(!server || !desiredRank || !title || !description || !price || !currency|| !deliveryTime || !stock || !duration || !serviceType){
//             throw createHttpError(400,"LolBoostEditCredentials missing")
//         } 

//         if(userId.toString()!==sellerId){
//             throw createHttpError(404,"User can't access this offer")
//         }

//         const lolBoostOffer = await LolOfferModels.LolBoostModel.findById(_id).exec()

//         if(!lolBoostOffer){
//             throw createHttpError(404,"lolAccountOffer not found")
//         }

//         lolBoostOffer.server= server
//         lolBoostOffer.desiredRank= desiredRank
//         lolBoostOffer.title= title
//         lolBoostOffer.description= description
//         lolBoostOffer.price= price
//         lolBoostOffer.currency= currency
//         lolBoostOffer.deliveryTime= deliveryTime
//         lolBoostOffer.stock= stock
//         lolBoostOffer.duration= duration
//         lolBoostOffer.serviceType= serviceType

        
//         const updatedLolBoostOffer = await lolBoostOffer.save();

//         res.status(200).json(updatedLolBoostOffer);

//     } catch (error) {
//         next(error)
//     }
// }


