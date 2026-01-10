import { getOffersReturnType } from "../components/pages/OffersPage"

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

//
export async function fetchOffersViaElasticSearch(serviceName:string, filter: string, sort:string, page:number, username?: string): Promise<getOffersReturnType>{
if(!serviceName) throw new Error('ES_api fetchOffers serviceName missing')
let response
if(username){
    response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/elasticSearch/getOffersViaElasticSearch/?serviceName=` + serviceName + `&filter=`+ filter+ `&sort=` +sort + `&page=` +page + `&username=`+username,
    {method: "GET",credentials:"include"})
}else{
    response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/elasticSearch/getOffersViaElasticSearch/?serviceName=` + serviceName + `&filter=`+ filter+ `&sort=` +sort + `&page=` +page,
    {method: "GET",credentials:"include"})
}
    return response.json()
}