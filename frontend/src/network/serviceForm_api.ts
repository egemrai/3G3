import  * as LolModels  from "../models/offers/LolOfferModels"
import * as ValorantModels from "../models/offers/ValorantOfferModels"



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
/*------------------------------------------deleteOffer-------------------------------*/
export interface deleteOfferURLQUery{
    _id: string,
    sellerId: string,
    serviceName: string,
}
export async function deleteOffer(data:deleteOfferURLQUery){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/deleteOffer/?_id=`+ data._id +"&sellerId="+ data.sellerId +"&serviceName="+data.serviceName ,{
        method: "DELETE",
        credentials: "include"
    })
    return response
}


/*-----------------------------------------createGenericOffer------------------------------*/
export async function createOffer(credentials:any){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createOffer`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",    
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editOffer-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editOffer(credentials:any,editIdData:editIdData):Promise<any>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editOffer`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",   
            },credentials: "include",
            body: JSON.stringify({credentials:credentials,
                                  editIdData:editIdData
            })
        })
    return response.json()
}


/*------------------------------------------createLolBoost-------------------------------*/

export interface LolBoostCredentials{
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

export async function createLolBoostOffer(credentials:LolBoostCredentials){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createLolBoost`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",    
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editLolBoost-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editLolBoostOffer(credentials:LolBoostCredentials,editIdData:editIdData):Promise<LolModels.LolBoost>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editLolBoost`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",    
            },credentials: "include",
            body: JSON.stringify({credentials:credentials,
                                  editIdData:editIdData
            })
        })
    return response.json()
}

