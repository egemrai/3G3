import { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as LolOfferModels from "../models/offers/lol"
import * as ValorantOfferModels from "../models/offers/valorant"
import { Model } from "mongoose";

/*---------------------------DeleteOffer---------------------------------*/
interface deleteOfferURLQUery{
    _id: string,
    sellerId: string,
    serviceName: string,
}

export const deleteOffer: RequestHandler<unknown,unknown,unknown,deleteOfferURLQUery> = async (req,res,next) => {
    const userId= req.session.userId
    const {serviceName, _id, sellerId} = req.query
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offerModelMap : Record<string, Model<any>> = {
        "LolAccountModel": LolOfferModels.LolAccountModel,
        "LolBoostModel": LolOfferModels.LolBoostModel,
        "LolRPModel": LolOfferModels.LolRPModel,
        "LolCoachModel": LolOfferModels.LolCoachModel,
        "ValorantAccountModel": ValorantOfferModels.ValorantAccountModel,
        "ValorantBoostModel": ValorantOfferModels.ValorantBoostModel,
        "ValorantVPModel": ValorantOfferModels.ValorantVPModel,
        "ValorantCoachModel": ValorantOfferModels.ValorantCoachModel,
    }
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

        await offer.deleteOne();

        console.log(offerModelMap)

        res.sendStatus(204);

    } catch (error) {
        next(error)
    }
    
}

/*--------------------------LolAccountCreate-----------------------------*/

interface LolAccountBody{
        server: string,
        rank: string,
        champions: number,
        skins: number,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number,
        active?: boolean
}

export const createLolAccountOffer: RequestHandler<unknown,unknown,LolAccountBody,unknown> = async(req,res,next)=>{
    const {server,rank,champions,skins,title,description,price,currency,deliveryTime,stock} = req.body
    const userId = req.session.userId

    try {
        if(!server || !rank || !champions || !skins || !title || !description || !price || !currency || !deliveryTime || !stock){
            throw createHttpError(400,"LolAccountCredentials missing")
        } 

        if(!userId){
            throw createHttpError(400,"userId(seller) missing")
        } 

        const newLolAccount= await LolOfferModels.LolAccountModel.create({
            sellerId: userId,
            categoryName: "Lol",
            serviceName: "LolAccount",
            server: server,
            rank: rank,
            champions: champions,
            skins: skins,
            title: title,
            description: description,
            price: price,
            currency: currency,
            deliveryTime: deliveryTime,
            stock: stock,
        })
        
        res.status(200).json(newLolAccount)

    } catch (error) {
        next(error)
    }
    
}

/*--------------------------editLolAccount-----------------------------*/
interface LolAccountEditBody{
    credentials:{
        server: string,
        rank: string,
        champions: number,
        skins: number,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number
    },
    editIdData:{
        _id: string,
        sellerId: string,
    }
}

export const editLolAccountOffer:RequestHandler<unknown,unknown,LolAccountEditBody,unknown> = async(req,res,next) =>{
    const {server,rank,champions,skins,title,description,price,currency,deliveryTime,stock} = req.body.credentials
    const {_id,sellerId} = req.body.editIdData
    const userId = req.session.userId

    try {
        if(!userId){
            throw createHttpError(404, "session userId missing")
        }

        if(!server || !rank || !champions || !skins || !title || !description || !price || !currency || !deliveryTime || !stock){
            throw createHttpError(400,"LolAccountEditCredentials missing")
        } 

        if(userId.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const lolAccountOffer = await LolOfferModels.LolAccountModel.findById(_id).exec()

        if(!lolAccountOffer){
            throw createHttpError(404,"lolAccountOffer not found")
        }

        lolAccountOffer.server= server
        lolAccountOffer.rank= rank
        lolAccountOffer.champions= champions
        lolAccountOffer.skins= skins
        lolAccountOffer.title= title
        lolAccountOffer.description= description
        lolAccountOffer.price= price
        lolAccountOffer.currency= currency
        lolAccountOffer.deliveryTime= deliveryTime
        lolAccountOffer.stock= stock

        
        const updatedLolAccountOffer = await lolAccountOffer.save();

        res.status(200).json(updatedLolAccountOffer);

    } catch (error) {
        next(error)
    }
}

/*--------------------------createLolBoost-----------------------------*/

interface LolBoostBody{
    server: string,
    desiredRank: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
    duration: number,
    serviceType: string,
}

export const createLolBoostOffer:RequestHandler<unknown,unknown,LolBoostBody,unknown> = async(req, res, next)=>{
    const {server,desiredRank,title,description,price,currency,deliveryTime,stock,duration,serviceType} = req.body
    const userId = req.session.userId

    try {
        if(!server || !desiredRank || !title || !description || !price || !currency || !deliveryTime || !stock || !duration || !serviceType){
            throw createHttpError(400,"LolBoostCredentials missing")
        }
        
        if(!userId){
            throw createHttpError(400,"userId(seller) missing")
        } 

        const newLolBoost= await LolOfferModels.LolBoostModel.create({
            sellerId: userId,
            categoryName: "Lol",
            serviceName: "LolBoost",
            server: server,
            desiredRank: desiredRank,
            title: title,
            description: description,
            price: price,
            currency: currency,
            deliveryTime: deliveryTime,
            stock: stock,
            duration: duration,
            serviceType: serviceType,
        })

        res.status(200).json(newLolBoost)

    } catch (error) {
        next(error)
    }

}

/*--------------------------editLolBoost-----------------------------*/
interface LolBoostEditBody{
    credentials:{
        server: string,
        desiredRank: string,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number,
        duration: number,
        serviceType: string,
    },
    editIdData:{
        _id: string,
        sellerId: string,
    }
}
export const editLolBoostOffer:RequestHandler<unknown,unknown,LolBoostEditBody,unknown> = async(req,res,next) =>{
    const {server,desiredRank,title,description,price,currency,deliveryTime,stock,duration,serviceType} = req.body.credentials
    const {_id,sellerId} = req.body.editIdData
    const userId = req.session.userId

    try {
        if(!userId){
            throw createHttpError(404, "session userId missing")
        }

        if(!server || !desiredRank || !title || !description || !price || !currency|| !deliveryTime || !stock || !duration || !serviceType){
            throw createHttpError(400,"LolBoostEditCredentials missing")
        } 

        if(userId.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const lolBoostOffer = await LolOfferModels.LolBoostModel.findById(_id).exec()

        if(!lolBoostOffer){
            throw createHttpError(404,"lolAccountOffer not found")
        }

        lolBoostOffer.server= server
        lolBoostOffer.desiredRank= desiredRank
        lolBoostOffer.title= title
        lolBoostOffer.description= description
        lolBoostOffer.price= price
        lolBoostOffer.currency= currency
        lolBoostOffer.deliveryTime= deliveryTime
        lolBoostOffer.stock= stock
        lolBoostOffer.duration= duration
        lolBoostOffer.serviceType= serviceType

        
        const updatedLolBoostOffer = await lolBoostOffer.save();

        res.status(200).json(updatedLolBoostOffer);

    } catch (error) {
        next(error)
    }
}


/*-----------------------------createLolCoach--------------------------------*/

interface LolCoachBody{
    server: string,
    rank: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
    duration: number,
    active?: boolean
}

export const createLolCoachOffer:RequestHandler<unknown,unknown,LolCoachBody,unknown> = async(req,res,next) =>{
    const {server,rank,title,description,price,currency,deliveryTime,stock,duration} = req.body
    const userId = req.session.userId

    try {
        if(!server || !rank || !title || !description || !price || !currency|| !deliveryTime || !stock || !duration){
            throw createHttpError(400,"LolCoachCredentials missing")
        } 

        if(!userId){
            throw createHttpError(400,"userId(seller) missing")
        } 

        const newLolCoach= await LolOfferModels.LolCoachModel.create({
            sellerId: userId,
            categoryName: "Lol",
            serviceName: "LolCoach",
            server: server,
            rank: rank,
            title: title,
            description: description,
            price: price,
            currency: currency,
            deliveryTime: deliveryTime,
            stock: stock,
            duration: duration,
        })
        
        res.status(200).json(newLolCoach)
    } catch (error) {
        next(error)
    }
}

/*--------------------------editLolCoach-----------------------------*/
interface LolCoachEditBody{
    credentials:{
        server: string,
        rank: string,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number,
        duration: number,
    },
    editIdData:{
        _id: string,
        sellerId: string,
    }
}
export const editLolCoachOffer:RequestHandler<unknown,unknown,LolCoachEditBody,unknown> = async(req,res,next) =>{
    const {server,rank,title,description,price,currency,deliveryTime,stock,duration} = req.body.credentials
    const {_id,sellerId} = req.body.editIdData
    const userId = req.session.userId

    try {
        if(!userId){
            throw createHttpError(404, "session userId missing")
        }

        if(!server || !rank || !title || !description || !price || !currency || !deliveryTime || !stock || !duration){
            throw createHttpError(400,"LolBoostEditCredentials missing")
        } 

        if(userId.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const lolCoachOffer = await LolOfferModels.LolCoachModel.findById(_id).exec()

        if(!lolCoachOffer){
            throw createHttpError(404,"lolCoachOffer not found")
        }

        lolCoachOffer.server= server
        lolCoachOffer.rank= rank
        lolCoachOffer.title= title
        lolCoachOffer.description= description
        lolCoachOffer.price= price
        lolCoachOffer.currency= currency
        lolCoachOffer.deliveryTime= deliveryTime
        lolCoachOffer.stock= stock
        lolCoachOffer.duration= duration
        
        const updatedLolCoachOffer = await lolCoachOffer.save();

        res.status(200).json(updatedLolCoachOffer);

    } catch (error) {
        next(error)
    }
}

/*-----------------------------createLolRP--------------------------------*/

interface LolRPBody{
    server: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number
}

export const createLolRPOffer:RequestHandler<unknown,unknown,LolRPBody,unknown> = async(req,res,next) =>{
    const {server,title,description,price,currency,deliveryTime,stock} = req.body
    const userId = req.session.userId

    try {
        if(!server || !title || !description || !price || !currency|| !deliveryTime || !stock){
            throw createHttpError(400,"LolRPCredentials missing")
        }
        
        if(!userId){
            throw createHttpError(400,"userId(seller) missing")
        }

        const newLolRP= await LolOfferModels.LolRPModel.create({
            sellerId: userId,
            categoryName: "Lol",
            serviceName: "LolRP",
            server: server,
            title: title,
            description: description,
            price: price,
            currency: currency,
            deliveryTime: deliveryTime,
            stock: stock,
        })

        res.status(200).json(newLolRP)
        
    } catch (error) {
        next(error)
    }
}

/*--------------------------editLolRP-----------------------------*/
interface LolRPEditBody{
    credentials:{
        server: string,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number,
    },
    editIdData:{
        _id: string,
        sellerId: string,
    }
}
export const editLolRPOffer:RequestHandler<unknown,unknown,LolRPEditBody,unknown> = async(req,res,next) =>{
    const {server,title,description,price,currency,deliveryTime,stock} = req.body.credentials
    const {_id,sellerId} = req.body.editIdData
    const userId = req.session.userId

    try {
        if(!userId){
            throw createHttpError(404, "session userId missing")
        }

        if(!server ||!title || !description || !price || !currency || !deliveryTime || !stock){
            throw createHttpError(400,"LolRPEditCredentials missing")
        } 
        
        if(userId.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const lolRPOffer = await LolOfferModels.LolRPModel.findById(_id).exec()

        if(!lolRPOffer){
            throw createHttpError(404,"lolRPOffer not found")
        }

        lolRPOffer.server= server
        lolRPOffer.title= title
        lolRPOffer.description= description
        lolRPOffer.price= price
        lolRPOffer.currency= currency
        lolRPOffer.deliveryTime= deliveryTime
        lolRPOffer.stock= stock

        
        const updatedLolRPOffer = await lolRPOffer.save();

        res.status(200).json(updatedLolRPOffer);

    } catch (error) {
        next(error)
    }
}
/*-----------------------------createValorantAccount--------------------------------*/

interface ValorantAccountBody{
    server: string,
    rank: string,
    agents: number,
    skins: number,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
    active?: boolean
}

export const createValorantAccountOffer:RequestHandler<unknown,unknown,ValorantAccountBody,unknown> = async(req,res,next) =>{
    const {server,rank,agents,skins,title,description,price,currency,deliveryTime,stock} = req.body
    const userId = req.session.userId

    try {
        if(!server || !rank || !agents || !skins || !title || !description || !price || !currency || !deliveryTime || !stock){
            throw createHttpError(400,"ValorantAccountCredentials missing")
        } 

        if(!userId){
            throw createHttpError(400,"userId(seller) missing")
        } 

        const newValorantAccount = await ValorantOfferModels.ValorantAccountModel.create({
            sellerId: userId,
            categoryName: "Valorant",
            serviceName: "ValorantAccount",
            agents: agents,
            skins: skins,
            server: server,
            rank: rank,
            title: title,
            description: description,
            price: price,
            currency: currency,
            deliveryTime: deliveryTime,
            stock: stock,
        })
        
        res.status(200).json(newValorantAccount)
    } catch (error) {
        next(error)
    }
}
/*--------------------------editValorantAccount-----------------------------*/
interface ValorantAccountEditBody{
    credentials:{
        server: string,
        rank: string,
        agents: number,
        skins: number,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number,
    },
    editIdData:{
        _id: string,
        sellerId: string,
    }
}

export const editValorantAccountOffer:RequestHandler<unknown,unknown,ValorantAccountEditBody,unknown> = async(req,res,next) =>{
    const {server,rank,agents,skins,title,description,price,currency,deliveryTime,stock} = req.body.credentials
    const {_id,sellerId} = req.body.editIdData
    const userId = req.session.userId

    try {
        if(!userId){
            throw createHttpError(404, "session userId missing")
        }

        if(!server || !title || !rank|| !agents || !skins || !description || !price || !currency || !deliveryTime || !stock){
            throw createHttpError(400,"ValorantAccountEditCredentials missing")
        } 
        
        if(userId.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const valorantAccountOffer = await ValorantOfferModels.ValorantAccountModel.findById(_id).exec()

        if(!valorantAccountOffer){
            throw createHttpError(404,"valorantAccountOffer not found")
        }

        valorantAccountOffer.server= server
        valorantAccountOffer.rank= rank
        valorantAccountOffer.agents= agents
        valorantAccountOffer.skins= skins
        valorantAccountOffer.title= title
        valorantAccountOffer.description= description
        valorantAccountOffer.price= price
        valorantAccountOffer.currency= currency
        valorantAccountOffer.deliveryTime= deliveryTime
        valorantAccountOffer.stock= stock

        
        const updatedValorantAccountOffer = await valorantAccountOffer.save();

        res.status(200).json(updatedValorantAccountOffer);

    } catch (error) {
        next(error)
    }
}
/*-----------------------------createValorantBoost--------------------------------*/

interface ValorantBoostBody {
    server: string,
    desiredRank: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
    duration: number,
    serviceType: string,
}

export const createValorantBoostOffer:RequestHandler<unknown,unknown,ValorantBoostBody,unknown> = async(req,res,next)=>{
    const {server,desiredRank,title,description,price,currency,deliveryTime,stock,duration,serviceType} = req.body
    const userId = req.session.userId

    try {
        if(!server || !desiredRank || !title || !description || !price || !currency || !deliveryTime || !stock || !duration || !serviceType){
            throw createHttpError(400,"ValorantBoostCredentials missing")
        } 

        if(!userId){
            throw createHttpError(400,"userId(seller) missing")
        } 

        const newValorantBoost = await ValorantOfferModels.ValorantBoostModel.create({
            sellerId: userId,
            categoryName: "Valorant",
            serviceName: "ValorantBoost",
            server: server,
            desiredRank: desiredRank,
            title: title,
            description: description,
            price: price,
            currency: currency,
            deliveryTime: deliveryTime,
            stock: stock,
            duration: duration,
            serviceType: serviceType,
        })
        
        res.status(200).json(newValorantBoost)

    } catch (error) {
        next(error)
    }
}

/*--------------------------editValorantBoost-----------------------------*/
interface ValorantBoostEditBody{
    credentials:{
        server: string,
        desiredRank: string,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number,
        duration: number,
        serviceType: string,
    },
    editIdData:{
        _id: string,
        sellerId: string,
    }
}

export const editValorantBoostOffer:RequestHandler<unknown,unknown,ValorantBoostEditBody,unknown> = async(req,res,next) =>{
    const {server,desiredRank,title,description,price,currency,deliveryTime,stock,duration,serviceType} = req.body.credentials
    const {_id,sellerId} = req.body.editIdData
    const userId = req.session.userId

    try {
        if(!userId){
            throw createHttpError(404, "session userId missing")
        }

        if(!server || !title || !desiredRank || !description || !price || !currency|| !deliveryTime || !stock || !duration || !serviceType){
            throw createHttpError(400,"ValorantBoostEditCredentials missing")
        } 
    
        if(userId.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const valorantBoostOffer = await ValorantOfferModels.ValorantBoostModel.findById(_id).exec()

        if(!valorantBoostOffer){
            throw createHttpError(404,"valorantBoostOffer not found")
        }

        valorantBoostOffer.server= server
        valorantBoostOffer.desiredRank= desiredRank
        valorantBoostOffer.title= title
        valorantBoostOffer.description= description
        valorantBoostOffer.price= price
        valorantBoostOffer.currency= currency
        valorantBoostOffer.deliveryTime= deliveryTime
        valorantBoostOffer.stock= stock
        valorantBoostOffer.duration= duration
        valorantBoostOffer.serviceType= serviceType

        
        const updatedValorantBoostOffer = await valorantBoostOffer.save();

        res.status(200).json(updatedValorantBoostOffer);

    } catch (error) {
        next(error)
    }
}
/*-----------------------------createValorantCoach--------------------------------*/

interface ValorantCoachBody {
    server: string,
    rank: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
    duration: number,
}

export const createValorantCoachOffer:RequestHandler<unknown,unknown,ValorantCoachBody,unknown> = async(req,res,next)=>{
    const {server,rank,title,description,price,currency,deliveryTime,stock,duration} = req.body
    const userId = req.session.userId

    try {
        if(!server || !rank || !title || !description || !price || !currency || !deliveryTime || !stock || !duration){
            throw createHttpError(400,"ValorantCoachCredentials missing")
        } 

        if(!userId){
            throw createHttpError(400,"userId(seller) missing")
        } 

        const newValorantCoach = await ValorantOfferModels.ValorantCoachModel.create({
            sellerId: userId,
            categoryName: "Valorant",
            serviceName: "ValorantCoach",
            server: server,
            rank: rank,
            title: title,
            description: description,
            price: price,
            currency: currency,
            deliveryTime: deliveryTime,
            stock: stock,
            duration: duration,
        })
        
        res.status(200).json(newValorantCoach)

    } catch (error) {
        next(error)
    }
}

/*--------------------------editValorantCoach-----------------------------*/
interface ValorantCoachEditBody{
    credentials:{
        server: string,
        rank: string,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number,
        duration: number,
    },
    editIdData:{
        _id: string,
        sellerId: string,
    }
}

export const editValorantCoachOffer:RequestHandler<unknown,unknown,ValorantCoachEditBody,unknown> = async(req,res,next) =>{
    const {server,rank,title,description,price,currency,deliveryTime,stock,duration} = req.body.credentials
    const {_id,sellerId} = req.body.editIdData
    const userId = req.session.userId

    try {
        if(!userId){
            throw createHttpError(404, "session userId missing")
        }

        if(!server || !title || !rank || !description || !price || !currency|| !deliveryTime || !stock || !duration){
            throw createHttpError(400,"ValorantCoachEditCredentials missing")
        } 
        
        if(userId.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const valorantCoachOffer = await ValorantOfferModels.ValorantCoachModel.findById(_id).exec()

        if(!valorantCoachOffer){
            throw createHttpError(404,"valorantCoachOffer not found")
        }

        valorantCoachOffer.server= server
        valorantCoachOffer.rank= rank
        valorantCoachOffer.title= title
        valorantCoachOffer.description= description
        valorantCoachOffer.price= price
        valorantCoachOffer.currency= currency
        valorantCoachOffer.deliveryTime= deliveryTime
        valorantCoachOffer.stock= stock
        valorantCoachOffer.duration= duration

        
        const updatedValorantCoachOffer = await valorantCoachOffer.save();

        res.status(200).json(updatedValorantCoachOffer);

    } catch (error) {
        next(error)
    }
}
/*-----------------------------createValorantVP--------------------------------*/

interface ValorantVPBody {
    server: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
}

export const createValorantVPOffer:RequestHandler<unknown,unknown,ValorantVPBody,unknown> = async(req,res,next)=>{
    const {server,title,description,price,currency,deliveryTime,stock} = req.body
    const userId = req.session.userId

    try {
        if(!server || !title || !description || !price || !currency ||!deliveryTime ||!stock){
            throw createHttpError(400,"ValorantVPCredentials missing")
        } 

        if(!userId){
            throw createHttpError(400,"userId(seller) missing")
        } 

        const newValorantVP = await ValorantOfferModels.ValorantVPModel.create({
            sellerId: userId,
            categoryName: "Valorant",
            serviceName: "ValorantVP",
            server: server,
            title: title,
            description: description,
            price: price,
            currency: currency,
            deliveryTime: deliveryTime,
            stock: stock,
        })
        
        res.status(200).json(newValorantVP)

    } catch (error) {
        next(error)
    }
}

/*--------------------------editValorantVP-----------------------------*/
interface ValorantVPEditBody{
    credentials:{
        server: string,
        title: string,
        description: string,
        price: number,
        currency: string,
        deliveryTime: number,
        stock: number,
    },
    editIdData:{
        _id: string,
        sellerId: string,
    }
}

export const editValorantVPOffer:RequestHandler<unknown,unknown,ValorantVPEditBody,unknown> = async(req,res,next) =>{
    const {server,title,description,price,currency,deliveryTime,stock} = req.body.credentials
    const {_id,sellerId} = req.body.editIdData
    const userId = req.session.userId

    try {
        if(!userId){
            throw createHttpError(404, "session userId missing")
        }

        if(!server || !title || !description || !price || !currency ||!deliveryTime ||!stock){
            throw createHttpError(400,"ValorantVPEditCredentials missing")
        } 
        
        if(userId.toString()!==sellerId){
            throw createHttpError(404,"User can't access this offer")
        }

        const valorantVPOffer = await ValorantOfferModels.ValorantVPModel.findById(_id).exec()

        if(!valorantVPOffer){
            throw createHttpError(404,"valorantVPOffer not found")
        }

        valorantVPOffer.server= server
        valorantVPOffer.title= title
        valorantVPOffer.description= description
        valorantVPOffer.price= price
        valorantVPOffer.currency= currency
        valorantVPOffer.deliveryTime= deliveryTime
        valorantVPOffer.stock= stock

        
        const updatedValorantVPOffer = await valorantVPOffer.save();

        res.status(200).json(updatedValorantVPOffer);

    } catch (error) {
        next(error)
    }
}