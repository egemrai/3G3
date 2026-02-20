/* eslint-disable @typescript-eslint/no-explicit-any */
import { elasticSearchClient } from "../client"
import { LolModel } from "../../models/offers/lol"
import { ValorantModel } from "../../models/offers/valorant"
import { ensureListingsIndex } from "./ensureIndex"

// tek offerı ESye kaydetmek için , worker offer.ts içinde kullanılıyor create ve edit kısmında
export async function indexJustOneOffer(doc: any) {
  try {
    const {_id:id, sellerId, ...docWithNo_id} = doc  // const id = doc._id ile aynı şey
    await elasticSearchClient.index({
      index: "offers",
      id:id.toString(),
      document: {
        ...docWithNo_id,  //document içinde ES id kabul etmediği için çıkardım
        sellerId: sellerId._id,
        sellerUsername: sellerId.username, // reindexToEs kısmında populate var diye böyle username alabildim
        // _id: id,
        // sellerId: String(docWithNo_id.sellerId),
        
      },
    })
  } catch (error) {
    console.error(error)
  }
  
}

//BULK INDEX OFFERS  KISMI
const models = [LolModel,ValorantModel]

export async function getDocs() {
  try {
    const docs = await Promise.all(models.map(async(model)=>{
    
    return(
      await model.find().populate({path:'sellerId',
        model:'User',
        select: "_id username"})
        .lean()
      )
  }))

  return docs.flat(1)
  } catch (error) {
    console.error(error)
  }
  
}

function setIndexBody(docs:any) {
  try {
    const body = docs.flatMap((doc:any)=>{ // 2 object return ettiğim için [] içine almak zorunda kaldım, [] iptal etmek için de flatMap kullandım
    const {_id:id, sellerId, ...docWithNo_id} = doc
    return(
      [{ index: { _index: "offers", _id: id.toString() } },
      {...docWithNo_id,  //document içinde ES id kabul etmediği için çıkardım
      sellerId: sellerId._id,
      sellerUsername: sellerId.username, // reindexToEs kısmında populate var diye böyle username alabildim
      }]
    )

    
    })
    return body
  } catch (error) {
    console.error(error)
  }
  
}


export async function indexOffers() {
  try {
    const docs = await getDocs()
  const body =  setIndexBody(docs)

  await ensureListingsIndex()

  let result 

  const chunk = 1000

  for (let i = 0; i < body.length; i += chunk) {
    const slicedBody = body.slice(i, i + chunk)

    result = await elasticSearchClient.bulk({ body: slicedBody }) // bulk fonksiyonu için parametre adı "body" olmak zorundaymış, o yüzden body: slicedBody yaptım
  
  }

  // console.log('ES buld index offers result:', result)
  
  // result?.items.forEach((item,i) => {
  //   console.log(`item.index ${i}. :`,item.index)
  // })

  if(result?.errors){
    const failed:any = []

    result.items.forEach((item)=>{
      
      const op = item.index || item.create || item.update
      // item bunlardan biri olduğu için yukarıda op tanımladık, bulk index log çıktısında ayrıntılı anlarsın; masaüstü ssde var

      if(op?.error){
        failed.push({
          id: op._id,
          error: op.error,
          status: op.status
        })
      }
    })

    // console.log("bulk index offers errors:", failed)
    // fail olanları bi yere kaydet, istersen sonra uğraş

    console.log('offers indexed to ES with min 1 error(s)')
    
    }
    else if(result){
      console.log('offers 100% successfully indexed to ES')
      
    }

    return  {count: result?.items.length || '?'}
  } catch (error) {
    console.error(error)
  }
  

}