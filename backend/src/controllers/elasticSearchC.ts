/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express"
import { elasticSearchClient } from "../elasticSearch/client";
import { reindexLolToES } from "../elasticSearch/reindexLolToES";
import createHttpError from "http-errors";

export const elasticSearchPingTest:RequestHandler = async(req,res,next)=>{
    try {
        // ES 8.x: ping() boolean döner
    const ok = await elasticSearchClient.ping()
    const info = await elasticSearchClient.info()

     res.json({
      ok,
      clusterName: info.cluster_name,
      clusterUuid: info.cluster_uuid,
      version: info.version?.number,
      tagline: info.tagline,
    })
    } catch (error) {
        next(error)
    }

}

export const reindexLolRequest:RequestHandler = async(req,res,next) =>{
    console.log("reindexLolRequeste girdi")
    try {
        const result = await reindexLolToES()
        res.json(result)
    } catch (error) {
        next(error)
    }
}

export const getElasticSearchOffersCount:RequestHandler = async(req,res,next)=>{

    try {
        const result = await elasticSearchClient.count({
            index: 'offers'
        })
        res.json(result)
    } catch (error) {
        next(error)
    }
}

export const getElasticSearchAllOffers:RequestHandler = async(req,res,next)=>{

    try {
        const result = await elasticSearchClient.search({
            index: 'offers',
            size: 100
        })
        res.json(result)
    } catch (error) {
        next(error)
    }
}

interface getOffersViaElasticSearchQuery{
    filter: string
    sort: string
    serviceName: string
    username: string
}
type RangeValue={
    min?:number,
    max?:number
}
export const getOffersViaElasticSearch:RequestHandler<unknown,unknown,unknown,getOffersViaElasticSearchQuery>= async(req,res,next)=>{
    let parsedFilter: any = {}

    if (typeof req.query.filter === "string" && req.query.filter.trim() !== "") {
    try {
        parsedFilter = JSON.parse(req.query.filter)
    } catch {
        throw createHttpError(400, "filter JSON formatı hatalı")
    }
    }
    
    const {searchInput:q, ...restOfFilter} = parsedFilter
    const sort = req.query.sort
    const serviceName= req.query.serviceName
    const username= req.query.username
    
    let range:Record<string,RangeValue>={} //range filterları ayarlamak için 

    const body = {
        index: "offers",
        //   from: (page - 1) * limit,
        //   size: limit,
        //   sort: [
        //     { _score: "desc" },
        //     { createdAt: "desc" }
        //   ],
        query: {
            bool: {
            must: [] as any[],
            filter: [] as any[]
            }
        }
    }

    try {
        if(!serviceName){
            throw createHttpError(404,"serviceName missing")
        }
        body.query.bool.filter.push({
                term:{
                    serviceName: serviceName
                },
            })

        if(username){
            body.query.bool.filter.push({
                    term:{
                        sellerUsername: username
                    },
                })
        }

        if(q && q.trim() !== '' ){
            body.query.bool.must.push({
                multi_match: {
                query: q,
                fields: ["title", "description"],
                },
            })
        }

        Object.entries(restOfFilter).forEach(([key,value])=>{
            if(value === undefined || value === null){
                return
            }
            else if(key.startsWith('min')){
                if(typeof value !== 'string') return
                if(value.trim() === '') return
                if (!/^\d+(\.\d+)?$/.test(value)) return
                const field = key.slice(3).toLowerCase()
                range = {...(range || {}),[field]: {...range[field], min: Number(value)}}
            }
            else if(key.startsWith('max')){
                if(typeof value !== 'string') return
                if(value.trim() === '') return
                if (!/^\d+(\.\d+)?$/.test(value)) return
                const field = key.slice(3).toLowerCase()
                range = {...range,[field]: {...range[field], max: Number(value)}}
            }
            else if(Array.isArray(value)){
                if(!(value.length>0)) return
                body.query.bool.filter.push({terms:{
                    [key]:value
                },})
            }
            else if(value === 'true' ||  value ==='false'){
                body.query.bool.filter.push({
                    term:{
                        [key]: value==='true'
                    },
                })
            } 
            else{
                body.query.bool.filter.push({
                    term:{
                        [key]: value
                    },
                })
            }
            
        })

        
        Object.entries(range).forEach(([key,value]:[string,RangeValue])=>{
            const minMaxObject:{gte?:number, lte?:number} = {}
            if(value.min !== undefined) minMaxObject.gte = value.min
            if(value.max !== undefined) minMaxObject.lte = value.max
    
            if(Object.keys(minMaxObject).length >0){
                body.query.bool.filter.push({
                    range:{
                        [key]: minMaxObject
                    },
                })
            }
            
        })

        const result = await elasticSearchClient.search(body) // düz filtrelenmiş ES datası

        const editedResult = result.hits.hits.map((offer)=>{  //ESden gelen datayı mongodan  gelmiş haline dönüştürüyorum, masaüstünde ss'i var açıklamalı. dosya  adı: getOffers Mongodan ESye geçiş aşaması
            const editedOffer = {...(offer._source as object),_id: offer._id }
            return(
            editedOffer
            )
        })
        res.status(200).json(editedResult)

        console.log('searchInput:',q)
        console.log('filter:',restOfFilter)
        console.log('sort:',sort)
        console.log('serviceName:',serviceName)
        console.log('username:',username)
        console.log('range:',range)

        
    } catch (error) {
        next(error)
    }
}

