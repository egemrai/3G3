
import { User } from "../models/user"
import { OfferSmall } from "../models/offerSmall"
import { SoldOffer, SoldOfferEditRatingForm } from "../models/SoldOffer"
import { SoldOfferForm } from "../models/SoldOffer"
import { Conversation } from "../models/chat"

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init)
    if(response.ok){
        return response
    }
    else{
        try {
            const errorBody= await response.json()
            const errorMessage= errorBody.error
            throw new Error(errorMessage)
        } catch (error) {
            throw new Error("failed to parse error")
        }
        
    } 
}

export async function fetchAllConversations(): Promise<Conversation[]> {
    const response =  await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/chat/fetchAllConversations`,{credentials: "include"})
    
    return response.json()
}

export async function sendMessage(credentials:any) {
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/chat/sendMessage`,{
        method:"POST",
        headers:{
        "Content-Type": "application/json",
        
        },credentials: "include",
        body: JSON.stringify(credentials)
    })

    return response.json()
}

export async function setSeenByReceiverTrue(conversationId:string) {
    const response =  await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/chat/setSeenByReceiverTrue/?conversationId=` + conversationId,{credentials: "include"})
    return response.json()
}

  


