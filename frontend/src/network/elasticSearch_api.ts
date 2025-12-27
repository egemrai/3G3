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

//
export async function fetchOffersViaElasticSearch(serviceName:string, filter: string, sort:string, username?: string): Promise<[]>{
if(!serviceName) throw new Error('ES_api fetchOffers serviceName missing')
let response
if(username){
    response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/elasticSearch/getOffersViaElasticSearch/?serviceName=` + serviceName + `&filter=`+ filter+ `&sort=` +sort + `&username=`+username,
    {method: "GET",credentials:"include"})
}else{
    response = await fetchData(`${process.env.REACT_APP_BACKEND_URL}/api/elasticSearch/getOffersViaElasticSearch/?serviceName=` + serviceName + `&filter=`+ filter+ `&sort=` +sort,
    {method: "GET",credentials:"include"})
}
    return response.json()
}