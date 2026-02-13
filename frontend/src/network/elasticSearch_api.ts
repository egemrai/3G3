import { getOffersReturnType } from "../components/pages/OffersPage"

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