import  * as LolModels  from "../models/offers/LolOfferModels"
import * as ValorantModels from "../models/offers/ValorantOfferModels"



async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, {
        credentials: "include",
        ...init
    })
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
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/deleteOffer/?_id=`+ data._id +"&sellerId="+ data.sellerId +"&serviceName="+data.serviceName+"Model" ,{
        method: "DELETE",
        credentials: "include"
    })
    return response
}

/*------------------------------------------createLolAccount-------------------------------*/
export interface LolAccountCredentials{
    server: string,
    rank: string,
    champions: number,
    skins: number,
    title: string,
    description: string,
    price: number,
    currency: string,
    active?: boolean,
    deliveryTime: number,
    stock: number,
}

export async function createLolAccountOffer(credentials:LolAccountCredentials){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createLolAccount`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",    
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editLolAccount-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editLolAccountOffer(credentials:LolAccountCredentials,editIdData:editIdData):Promise<LolModels.LolAccount>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editLolAccount`,{
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

/*------------------------------------------createLolCoach-------------------------------*/
export interface LolCoachCredentials{
    server: string,
    rank: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
    duration: number,
    active?: boolean
}
export async function createLolCoachOffer(credentials:LolCoachCredentials){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createLolCoach`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editLolCoach-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editLolCoachOffer(credentials:LolCoachCredentials,editIdData:editIdData):Promise<LolModels.LolCoach>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editLolCoach`,{
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

/*------------------------------------------createLolRP-------------------------------*/

export interface LolRPCredentials{
    server: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
}
export async function createLolRPOffer(credentials:LolRPCredentials){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createLolRP`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editLolRP-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editLolRPOffer(credentials:LolRPCredentials,editIdData:editIdData):Promise<LolModels.LolRP>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editLolRP`,{
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


/*------------------------------------------createValorantAccount-------------------------------*/
export interface ValorantAccountCredentials{
    server: string,
    rank: string,
    agents: number,
    skins: number,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
    active?: boolean
}
export async function createValorantAccountOffer(credentials:ValorantAccountCredentials){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createValorantAccount`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editValorantAccount-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editValorantAccountOffer(credentials:ValorantAccountCredentials,editIdData:editIdData):Promise<ValorantModels.ValorantAccount>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editValorantAccount`,{
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

/*------------------------------------------createValorantBoost-------------------------------*/
export interface ValorantBoostCredentials{
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
export async function createValorantBoostOffer(credentials:ValorantBoostCredentials){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createValorantBoost`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editValorantBoost-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editValorantBoostOffer(credentials:ValorantBoostCredentials,editIdData:editIdData):Promise<ValorantModels.ValorantBoost>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editValorantBoost`,{
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

/*------------------------------------------createValorantCoach-------------------------------*/
export interface ValorantCoachCredentials{
    server: string,
    rank: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
    duration: number,
}
export async function createValorantCoachOffer(credentials:ValorantCoachCredentials){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createValorantCoach`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editValorantCoach-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editValorantCoachOffer(credentials:ValorantCoachCredentials,editIdData:editIdData):Promise<ValorantModels.ValorantCoach>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editValorantCoach`,{
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

/*------------------------------------------createValorantVP-------------------------------*/
export interface ValorantVPCredentials{
    server: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    deliveryTime: number,
    stock: number,
}
export async function createValorantVPOffer(credentials:ValorantVPCredentials){
    const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/createValorantVP`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },credentials: "include",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

/*------------------------------------------editValorantVP-------------------------------*/
interface editIdData{
    sellerId: string,
    _id: string
}

    export async function editValorantVPOffer(credentials:ValorantVPCredentials,editIdData:editIdData):Promise<ValorantModels.ValorantVP>{
        const response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/createOffer/editValorantVP`,{
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