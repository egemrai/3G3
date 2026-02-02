import { elasticSearchClient } from "../client"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function indexDoc(doc: any) {
  console.log('indexDoca girdi')
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
}