
import { Conversation } from "../models/chat"

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init)
    if(response.ok){
        return response
    }
    else{
        let errorMessage = "Request failed"
        try {  
              const errorBody= await response.json()
              errorMessage= errorBody.error || errorMessage 
        } catch{
            // ignore json parse error
        }
        throw new Error(errorMessage)
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

  


