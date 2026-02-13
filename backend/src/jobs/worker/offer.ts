/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config"
import { Worker } from 'bullmq'
import { bullRedisConnection } from '../../redis/bullmq'
import offerModelMap from "../../utils/offerModelMap"
import mongoose from "mongoose";
import env from '../../utils/validateEnv'
import { indexDoc } from "../../elasticSearch/offer/indexDoc";
import '../../models'
import { elasticSearchClient } from "../../elasticSearch/client";

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(()=>{
console.log("✅ Worker Mongo connected")
})
.catch((err)=>{
  console.error(err)
})


const worker = new Worker(
  'offer-queue',
  async job => {
    try {
      if(job.name === 'createOfferForES'){
      
      
        // console.log('Job işleniyor:', job.id)
        // console.log('job.data:', job.data) // --> job.data: { offerId: '697eaf26983286255d0f3747' }
        // console.log('job.data.offerId:', job.data.offerId) // --> offer._id
        // console.log('offer.serviceName:', typeof job.data.offerServiceName) // --> LolRP 

        if(typeof job.data.offerServiceName !== 'string') throw Error

        const selectedModel = offerModelMap[job.data.offerServiceName.toString()]
        if(!selectedModel) throw Error

        const offer = await selectedModel.findById(job.data.offerId).populate({
        path:'sellerId',
        model:'User',
        select: "_id username"})
        .lean()
        // const offerExec = await selectedModel.findById(job.data.offerId).exec()
        

        indexDoc(offer)
        console.log('başarılı ES indexing')

      } 
      
      if(job.name === 'editOfferForES'){
        if(typeof job.data.offerServiceName !== 'string') throw Error

        const selectedModel = offerModelMap[job.data.offerServiceName.toString()]
        if(!selectedModel) throw Error

        const offer = await selectedModel.findById(job.data.offerId).populate({
        path:'sellerId',
        model:'User',
        select: "_id username"})
        .lean()
        // const offerExec = await selectedModel.findById(job.data.offerId).exec()
        

        indexDoc(offer)
        console.log('başarılı ES editing')
      }

      if(job.name === 'deleteOfferForES'){
        const offerId = job.data.offerId.toString()
        if(!offerId) throw Error

        elasticSearchClient.delete({
                    index:'offers',
                    id:offerId
        })
        console.log('başarılı ES delete ')
      }

    }
    catch (error) {
        console.error(error)
        throw error
      }
  },
  {
    connection: bullRedisConnection,
    concurrency: 1,  //1 workerın aynı anda yapabilceği iş sayısı, IO yoğunluksa ve sistem sağlamsa arttır,
  }
)

// 👇 BURAYA (dosyanın en altına)
process.on('SIGINT', async () => {
  console.log('Worker kapanıyor (SIGINT)...')
  await mongoose.disconnect()
  console.log('mongoose kapandı')
  await worker.close()
  process.exit(0)
  
})

process.on('SIGTERM', async () => {
  console.log('Worker kapanıyor (SIGTERM)...')
  await mongoose.disconnect()
  await worker.close()
  process.exit(0)
})