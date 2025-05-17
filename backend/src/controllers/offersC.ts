import { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as LolOfferModels from "../models/offers/lol"
import * as ValorantOfferModels from "../models/offers/valorant"
import UserModel from "../models/user"
import {  Model } from "mongoose";
import soldOfferModel from "../models/soldOffer";
import { io } from "../server";
import { userSocketMap } from "../server";

interface getOffersQuery{
    nosqlTableName: string
    username: string
}

//getOffersda sellerUsername erişmek için 2 kere fetch kullandım, performansı düşürüyodur fyi.
export const getOffers: RequestHandler<unknown,unknown,unknown,getOffersQuery> = async (req, res, next) => {
    const nosqlTableName= req.query.nosqlTableName
    const username= req.query.username
    let responseWithUsername
try {
    if(!nosqlTableName){
        throw createHttpError(404,"nosqlTableName yok knk")
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelMap: Record<string, Model<any>> = {
        "LolModel": LolOfferModels.LolModel,
        "LolAccountModel": LolOfferModels.LolAccountModel,
        "LolBoostModel": LolOfferModels.LolBoostModel,
        "LolRPModel": LolOfferModels.LolRPModel,
        "LolCoachModel": LolOfferModels.LolCoachModel,
        "ValorantModel": ValorantOfferModels.ValorantModel,
        "ValorantAccountModel": ValorantOfferModels.ValorantAccountModel,
        "ValorantBoostModel": ValorantOfferModels.ValorantBoostModel,
        "ValorantVPModel": ValorantOfferModels.ValorantVPModel,
        "ValorantCoachModel": ValorantOfferModels.ValorantCoachModel,
    };
    
    const SelectedModel = modelMap[nosqlTableName];
        if (!SelectedModel) {
            throw createHttpError(400, `Geçersiz modelName: ${nosqlTableName}`);
        }
        
    
    const    response = await SelectedModel.find({active: true}).lean().exec()  //active : "true" şeklinde arattığım için boş dönüyormuş
    //sellerUsername eklemek için lean() kullandım, fetchlenen mongoose datasını direkt js'e çeviriyor. yoksa yeni key ekleme çalışmadı. spread ile yapınca lean() olmadan da çalıştı, mongoose'un _doc:{} objesi dışında farklı bir obje olarak _doc:{}, serllerUsername:'test' olarak ekledi
    
    
    
    //sellerUsername EKLEME KISMI: sellerId ile kullanıcı datasından username çekip, offer object'ine ekledim
    responseWithUsername= await Promise.all(response.map( async offer => //map içinde await için Promise.all kullandım
        // (offer = {...offer, "sellerUsername": "test"})
        {
        const fetchedSellerUsernameObj=  await UserModel.findById(offer.sellerId.toString()).exec()
        if (!fetchedSellerUsernameObj) {
            throw createHttpError(400, `missing seller username Object: ${fetchedSellerUsernameObj}`);
        }
            offer["sellerUsername"] = fetchedSellerUsernameObj.username
            return(offer)
        }
    ))
    //USERNAME VARSA FİLTRELEME KISMI, offer'a sellerUsername yazmak için hazır önceden fetch kodu vardı, sadece filtre ekledim
    if(username){
        responseWithUsername = responseWithUsername.filter((offer)=>{
            return offer["sellerUsername"]===username
        })
    }
                            
    res.status(200).json(responseWithUsername)

} catch (error) {
    next(error)
}
}

//herhangi bir smallOffer'a tıkladıktan sonra açılan offer için bilgi çekme
// BU ŞU AN KULLANILMIYOR, OFFERPAGE BİLGİDİ STATE İLE ALIYOR, STATE YERİNE URL QUERY İLE BUNDAN BİLGİ ALMAYI AYARLICAM Bİ ARA
interface getOfferQuery {
    _id: string,
    nosqlTableName: string
}
interface GetOfferTest{
    sellerId: string,
    _id: string,
    [x:string]:string,
}
export const getOffer: RequestHandler<unknown,unknown,unknown,getOfferQuery> = async (req, res, next) => {
    const nosqlTableName= req.query.nosqlTableName
    const _id = req.query._id
try {
    if(!nosqlTableName){
        throw createHttpError(404,"nosqlTableName yok knk")
    }
    if(!_id){
        throw createHttpError(404,"_id yok knk")
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelMap: Record<string, Model<any>> = {
        "LolModel": LolOfferModels.LolModel,
        "LolAccountModel": LolOfferModels.LolAccountModel,
        "LolBoostModel": LolOfferModels.LolBoostModel,
        "LolRPModel": LolOfferModels.LolRPModel,
        "LolCoachModel": LolOfferModels.LolCoachModel,
        "ValorantModel": ValorantOfferModels.ValorantModel,
        "ValorantAccountModel": ValorantOfferModels.ValorantAccountModel,
        "ValorantBoostModel": ValorantOfferModels.ValorantBoostModel,
        "ValorantVPModel": ValorantOfferModels.ValorantVPModel,
        "ValorantCoachModel": ValorantOfferModels.ValorantCoachModel,
    };
    
    const SelectedModel = modelMap[nosqlTableName];
        if (!SelectedModel) {
            throw createHttpError(400, `Geçersiz modelName: ${nosqlTableName}`);
        }

    const offer = await SelectedModel.findById(_id).lean().exec() as GetOfferTest  
    if( !offer ){
        throw createHttpError(400, `offer yok`);
    }

    //offer'a sellerUsername ekleme kısmı
    const sellerUsername = await UserModel.findById(offer.sellerId.toString()).exec()
    if(!sellerUsername){
        throw createHttpError(400, `sellerUsername yok`);
    }
    // const response = offer.toObject()  //lean() olmadan fetch ettikten sonra, offer'ı böyle object yapıp "sellerUsername" eklemiştim. Sonra tüm fonksiyonlar aynı olsun diye buna da lean ekledim
    const response = offer
    response["sellerUsername"] = sellerUsername.username
    res.status(200).json(response)

} catch (error) {
    next(error)
}
}




// manage offer page için kullanıcının idsi ile offer arama fonksiyonu, tüm collectionlarda arama yapılacağı için 1'den çok arama
//  olucak ve toplanan tüm offer datasını 1 arrayde birleştirip return edicem. session.Id ile arama yapıcam

//userProfilePage için satıcının tüm offer'larını da buradan fetch edicem, başkasının profile bakınca session.userId olmadığı için
// query ile username yollayıp, sellerId bulmak için önce databasede arama yapıcam, sonra id ile tüm offerları fetch kısmı aynı.
// yani manageOffer için kullanılan fonksiyonu, userProfile için de kullanılır hale getiricem
export const getOffersForManageOffers:RequestHandler = async(req,res,next)=>{
    const user_id= req.session.userId 
    try {
        
        if(!user_id){
            throw createHttpError(404,"session userId missing")
        }    
        
        // const fetchedLolOffers = await LolModel.find({sellerId: user_id}).exec()
        // const fetchedValorantOffers = await ValorantModel.find({sellerId: user_id}).exec()

        // const allOffers = fetchedLolOffers.concat(fetchedValorantOffers)

            const [fetchedLolOffers, fetchedValorantOffers] = await Promise.all([
                LolOfferModels.LolModel.find({ sellerId: user_id }).exec(),
                ValorantOfferModels.ValorantModel.find({ sellerId: user_id }).exec()
            ]);

            const allOffers = [...fetchedLolOffers, ...fetchedValorantOffers];

            console.log(allOffers)
    
            res.status(200).json(allOffers)
        
        
       

    } catch (error) {
        next(error)
    }
}

interface getOffersForUserProfileQuery{
    username?: string
}

export const getOffersForUserProfile:RequestHandler<unknown,unknown,unknown,getOffersForUserProfileQuery> = async(req,res,next) =>{
    const username= req.query.username
    try {

        if(!username){
            createHttpError(404, "username missing")
        }

        const fetchedUserId= await UserModel.findOne({username: username}, "_id").exec() //sadece _id datasını aldım, performans için
        if(!fetchedUserId){
            createHttpError(404,"böyle bir username yok")
        }

        const [fetchedLolOffers, fetchedValorantOffers] = await Promise.all([
            LolOfferModels.LolModel.find({ sellerId: fetchedUserId }).exec(),
            ValorantOfferModels.ValorantModel.find({ sellerId: fetchedUserId }).exec()
        ]);
        

        const allOffers= [...fetchedLolOffers,...fetchedValorantOffers]

        res.status(200).json(allOffers)

    } catch (error) {
        next(error)
    }

}

interface SoldOfferBody{
    amount:number, offerDetails:object, buyAmount:number, categoryName:string, serviceName:string, sellerId:string,
    currency:string, description:string, price:number, title:string, _id:string,
    server?:string, rank?:string, champions?:number, skins?:number, deliveryTime?:number, stock?:number, 
    desiredRank?:string, serviceType?: string, agents?:number
    
}

export const createSoldOffer:RequestHandler<unknown,unknown,SoldOfferBody,unknown> = async (req,res,next)=>{
const buyerId = req.session.userId
const {buyAmount:quantity,serviceName,categoryName,sellerId,currency,description,price,title, _id:offerId} = req.body

try {

    if(!buyerId || !offerId || !quantity || !categoryName ||!serviceName ||!sellerId ||!currency ||!description ||!price ||!title){
        throw createHttpError(404,"soldOffer missing parameters")
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelMap: Record<string, Model<any>> = {
        "LolModel": LolOfferModels.LolModel,
        "LolAccountModel": LolOfferModels.LolAccountModel,
        "LolBoostModel": LolOfferModels.LolBoostModel,
        "LolRPModel": LolOfferModels.LolRPModel,
        "LolCoachModel": LolOfferModels.LolCoachModel,
        "ValorantModel": ValorantOfferModels.ValorantModel,
        "ValorantAccountModel": ValorantOfferModels.ValorantAccountModel,
        "ValorantBoostModel": ValorantOfferModels.ValorantBoostModel,
        "ValorantVPModel": ValorantOfferModels.ValorantVPModel,
        "ValorantCoachModel": ValorantOfferModels.ValorantCoachModel,
    }
    const serviceNameModel = serviceName.concat("Model")
    const offerModel = modelMap[serviceNameModel]
    if(!offerModel){
        throw createHttpError(400,"createSoldOffer, stock kontrol fetch için offerModel yok")
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const boughtOffer= await offerModel.findById(offerId) as any
    if(!boughtOffer){
        throw createHttpError(400,"satın alınmak istenen offer yok")
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if(boughtOffer.stock && (quantity>boughtOffer.stock)){
        throw createHttpError(400,"satın alınmak istenen miktar stokta yok")
    }else{
        boughtOffer.stock= boughtOffer.stock-quantity
        await boughtOffer.save()
    }

    //YENİ CATEGORY YA DA SERVICE EKLEDİKCE OFFERDETAILS'A FAZLALIĞI EKLEMEYİ UNUTMA
    //ekstra offerDetails'a eklenicek şeyleri bu satır alına yazıyorum:
    //server, rank, champions, skins, deliveryTime, stock, desiredRank, serviceType, agents, 

    const newSoldOffer= await soldOfferModel.create({
        buyerId: buyerId,
        quantity: quantity,
        categoryName: categoryName,
        serviceName: serviceName,
        sellerId: sellerId,
        currency: currency,
        description: description,
        unitPrice: price,
        totalAmount: price*quantity,
        title: title,
        offerDetails:{
            server: req.body.server || "",
            rank: req.body.rank || "",
            champions: req.body.champions ?? "",
            skins: req.body.skins ?? "",
            deliveryTime: req.body.deliveryTime ?? "",
            stock: boughtOffer.stock ?? "",
            desiredRank: req.body.desiredRank || "",
            serviceType: req.body.serviceType || "",
            agents: req.body.agents ?? "",
        },
        offerCredentials:[]
        
    })

    const sellerSocketId = userSocketMap.get(sellerId)
    const message = "ürün satıldı kanks"
    if(sellerSocketId){
        sellerSocketId.forEach(eachSocketId=>
            io.to(eachSocketId).emit("soldOfferNotificationForSellerFromServer",{
                message,
                newSoldOffer
            })
        )
    }

    res.status(200).json(newSoldOffer)
} catch (error) {
    next(error)
}
}

export const fetchSoldOffers:RequestHandler= async(req,res,next)=>{
    const userId = req.session.userId
    try {
        const fetchedSoldOffers = await soldOfferModel.find({sellerId:userId})
        res.status(200).json(fetchedSoldOffers)
    } catch (error) {
        next(error)
    }
}

export const fetchBoughtOffers:RequestHandler= async(req,res,next)=>{
    const userId = req.session.userId
    try {
        const fetchedBoughtOffers = await soldOfferModel.find({buyerId:userId})
        res.status(200).json(fetchedBoughtOffers)
    } catch (error) {
        next(error)
    }
}
interface fetchSoldOffersWithIdQuery{
    userId: string
}
export const fetchSoldOffersWithId:RequestHandler<unknown,unknown,unknown,fetchSoldOffersWithIdQuery>= async(req,res,next)=>{
    const userId = req.query.userId
    try {
        const fetchedSoldOffers = await soldOfferModel.find({sellerId:userId, stage:"pending"})
        res.status(200).json(fetchedSoldOffers)
    } catch (error) {
        next(error)
    }
}

export const fetchBoughtOffersWithId:RequestHandler<unknown,unknown,unknown,fetchSoldOffersWithIdQuery>= async(req,res,next)=>{
    const userId = req.query.userId
    try {
        const fetchedBoughtOffers = await soldOfferModel.find({buyerId:userId, stage:"pending"})
        res.status(200).json(fetchedBoughtOffers)
    } catch (error) {
        next(error)
    }
}


//TransactionPage için 1 tane soldOffer fetch
interface fetchSoldOfferWithIdQuery{
    _id: string
}
export const fetchSoldOfferWithId:RequestHandler<unknown,unknown,unknown,fetchSoldOfferWithIdQuery>= async(req,res,next)=>{
    const offerId = req.query._id
    try {
        const fetchedBoughtOffer = await soldOfferModel.findById(offerId)
        res.status(200).json(fetchedBoughtOffer)
    } catch (error) {
        next(error)
    }
}

export const setSeenAllTrue:RequestHandler= async(req,res,next)=>{
    const userId = req.session.userId
    try {
        const fetchedSoldOffers = await soldOfferModel.find({sellerId:userId, seenBySeller:false})
        const fetchedBoughtOffers = await soldOfferModel.find({buyerId:userId, seenByBuyer:false})


        const setSeenBySellerTrue= await Promise.all(
            fetchedSoldOffers.map(async(offer)=>{
                offer.seenBySeller= true
                await offer.save()
                return offer
            })    
        )    
        const setSeenByBuyerTrue= await Promise.all(
            fetchedBoughtOffers.map(async (offer)=>{
                offer.seenByBuyer= true
                await offer.save()
                return offer
            })   
        )

        const test = [...setSeenBySellerTrue,...setSeenByBuyerTrue]

        res.status(200).json(test)
    } catch (error) {
        next(error)
    }
}

interface SoldOfferForm{  // react hook form type'ı için bunu ekstra yaptım
    offerCredentials: {
        accountId:string,
        accountPassword:string,
        email:string,
        emailPassword:string,
        serviceConfirm:string,
        code:string,
        extraNotes:string}[]
    }

interface SoldOfferCredentials{
    
    offerCredentials: SoldOfferForm,
    soldOfferId:string
}
export const setSoldOfferCredentials:RequestHandler<unknown,unknown,SoldOfferCredentials,unknown> = async(req,res,next) =>{
    const sellerId = req.session.userId
    const credentials = req.body.offerCredentials.offerCredentials
    const soldOfferId = req.body.soldOfferId
        try {
        if(!sellerId || !credentials || !soldOfferId){
            throw createHttpError(404,"setSoldOfferCredentials parametre yok")}

   
        // const fetchedSoldOffer = await soldOfferModel.findOneAndUpdate({sellerId:sellerId, _id:soldOfferId},{$set:{credentials}}, // $set olmadan çalışmadı çünkü mongoose key falan algılıyomuş, mk $set'i de array kabul etmiyomuş  {credentials} yaptım
        //     {
        //     new: true
        // }) 

        const fetchedSoldOffer = await soldOfferModel.findOne({sellerId:sellerId, _id:soldOfferId})

        if(fetchedSoldOffer?.stage !=="preparing"){
            throw createHttpError(404,"setSoldOfferCredentials parametre yok")
        }

        if(fetchedSoldOffer){
            fetchedSoldOffer.offerCredentials = credentials
            await fetchedSoldOffer?.save()
        }

        res.status(200).json(fetchedSoldOffer)

    } catch (error) {
        next(error)
    }
}

interface SoldOfferBody{
    soldOfferId:string
    offerStage:string
}
export const setSoldOfferStage:RequestHandler<unknown,unknown,SoldOfferBody,unknown> = async(req,res,next) =>{
    const sellerOrBuyerId = req.session.userId //iki tarafın da kullanması için yaptım, satıcı ve alıcının stage değişiklikleri belli, farklı biri olursa sessiondaki idleri uyuşmucağı için soldOffer bulanamıcak
    const soldOfferId = req.body.soldOfferId
    const stage = req.body.offerStage
        try {
        if(!sellerOrBuyerId || !soldOfferId || !stage){
            throw createHttpError(404,"setSoldOfferStage parametre yok")}


        if(stage==="preparing"|| stage=== "ready"){
            const fetchedSoldOffer = await soldOfferModel.findOne({sellerId:sellerOrBuyerId, _id:soldOfferId})

            // if(fetchedSoldOffer){
            //     fetchedSoldOffer.stage = stage
            //     await fetchedSoldOffer?.save()
            // }

            // res.status(200).json(fetchedSoldOffer)

            if(fetchedSoldOffer){                               //neye set olacağını direkt belirledim, böyle daha safe olur belki
                if(fetchedSoldOffer.stage ==="pending"){
                    fetchedSoldOffer.stage = "preparing"
                    await fetchedSoldOffer?.save()
                }
                
                else if(fetchedSoldOffer.stage ==="preparing"){
                    fetchedSoldOffer.stage = "ready"
                    fetchedSoldOffer.seenByBuyer = false
                    await fetchedSoldOffer?.save()

                    const buyerId =fetchedSoldOffer.buyerId.toString()
                    const buyerSocketId = userSocketMap.get(buyerId)
                    const message = "satıl aldığın ürünün bilgileri satıcı tarafından hazırlandı"
                    if(buyerSocketId){
                        buyerSocketId.forEach(eachSocketId =>
                            io.to(eachSocketId).emit("soldOfferNotificationForBuyerFromServer",{
                                message,
                                fetchedSoldOffer
                            })
                        )
                    
            }
                }
            }

            res.status(200).json(fetchedSoldOffer)
        }else if(stage==="viewed"|| stage=== "confirmed"){
            const fetchedSoldOffer = await soldOfferModel.findOne({buyerId:sellerOrBuyerId, _id:soldOfferId})

            if(fetchedSoldOffer){
                fetchedSoldOffer.stage = stage
                await fetchedSoldOffer?.save()
            }

            res.status(200).json(fetchedSoldOffer)
        }

    } catch (error) {
        next(error)
    }
}



export const deleteAllBoughtOffers:RequestHandler= async(req,res,next)=>{  //Postman için tüm collection silme requesti, websitesinde yok
    try {
         await soldOfferModel.deleteMany({})
        res.status(200).json(true)
    } catch (error) {
        next(error)
    }
}