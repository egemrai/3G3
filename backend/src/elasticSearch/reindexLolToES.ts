import { ensureListingsIndex } from "../elasticSearch/ensureIndex"
import { indexDoc } from "../elasticSearch/indexDoc"
import { LolModel } from "../models/offers/lol"

export async function reindexLolToES() {
    console.log('reindexLolToESe girdi')
  await ensureListingsIndex()

  const docs = await LolModel.find().populate({
    path:'sellerId',
    model:'User',
    select: "_id username"})
    .lean()
  for (const doc of docs) {
    await indexDoc(doc)
  }

  return { count: docs.length }
}