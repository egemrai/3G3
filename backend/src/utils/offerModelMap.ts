import { Model } from 'mongoose'
import * as LolOfferModels from '../models/offers/lol'
import * as ValorantOfferModels from '../models/offers/valorant'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const offerModelMap : Record<string, Model<any>> = {
    "LolAccount": LolOfferModels.LolAccountModel,
    "LolBoost": LolOfferModels.LolBoostModel,
    "LolRP": LolOfferModels.LolRPModel,
    "LolCoach": LolOfferModels.LolCoachModel,
    "ValorantAccount": ValorantOfferModels.ValorantAccountModel,
    "ValorantBoost": ValorantOfferModels.ValorantBoostModel,
    "ValorantVP": ValorantOfferModels.ValorantVPModel,
    "ValorantCoach": ValorantOfferModels.ValorantCoachModel,
}

export default offerModelMap