import { Category } from "../models/category"
import { Service } from "../models/service"
import { User } from "../models/user"
import { OfferSmall } from "../models/offerSmall"
import { SoldOffer, SoldOfferEditRatingForm } from "../models/SoldOffer"
import { SoldOfferForm } from "../models/SoldOffer"

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

export async function fetchCategories(): Promise<Category[]> {
    const response =  await fetchData("/api/category",{method: "GET"})
  
    return response.json()
  }
  
  export async function fetchServices(categoryName:string): Promise<Service[]> {
      const response = await fetchData("/api/category/" + categoryName+ "?testGameName=LOL",
          {method: "GET"})
  
      return response.json()
  }

  //userProfile'dan service'e tıklayınca, belli kişinin ürünleri görünmesi için username ekledim, username varsa 1 kişi, yoksa normal seçilen nosqlTableName ürünleri görüncek
  export async function fetchOffers(categoryName:string, serviceName: string, username?: string): Promise<[]>{
    const query = categoryName.concat(serviceName.toString())
    let response
    if(username){
      response = await fetchData("/api/offers/categoryName/serviceName/?nosqlTableName=" + query + "Model&username="+username,
      {method: "GET"})
    }else{
      response = await fetchData("/api/offers/categoryName/serviceName/?nosqlTableName=" + query + "Model",
      {method: "GET"})
    }
    
      return response.json()
  }

  export async function fetchOffersForManageOffers(): Promise<[]>{
  
    const response = await fetchData("/api/offers/getOffersForManageOffers/",
      {method: "GET"})

      return response.json()
  }

  export async function fetchOffersForUserProfile(username:string): Promise<[]>{
  
    const response = await fetchData("/api/offers/getOffersForUserProfile/?username=" +username,
      {method: "GET"})

      return response.json()
  }

  
  export async function fetchOffer(serviceName: string, _id: string): Promise<OfferSmall>{

    const response = await fetchData("/api/offers/getOffer/?nosqlTableName=" + serviceName + "Model&_id="+ _id,
      {method: "GET"})

      return response.json()
  }

  export async function createSoldOffer(credentials:any) {
    console.log(credentials)
    const response = await fetchData("/api/offers/createSoldOffer",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    })

    return response.json()
  }

  export async function fetchSoldOffers():Promise<SoldOffer[]> {
    const fetchedSoldOffers = await fetchData("/api/offers/fetchSoldOffers") //default method falan yazmayınca GET çalışıyor sanırım denicem

    return fetchedSoldOffers.json()
  }
  

  export async function fetchBoughtOffers():Promise<SoldOffer[]> {
    const fetchedBoughtOffers = await fetchData("/api/offers/fetchBoughtOffers") //default method falan yazmayınca GET çalışıyor sanırım denicem

    return fetchedBoughtOffers.json()
  }
  
  export async function fetchSoldOfferWithId(_id:string):Promise<SoldOffer> {
    const fetchedSoldOffers = await fetchData("/api/offers/fetchSoldOfferWithId/?_id="+_id) //default method falan yazmayınca GET çalışıyor sanırım denicem

    return fetchedSoldOffers.json()
  }
  //UserProfilePage rating için fetch edilen soldOfferlar
  export async function fetchBoughtOffersWithId(userId:string):Promise<SoldOffer[]> {
    const fetchedBoughtOffers = await fetchData("/api/offers/fetchBoughtOffersWithId/?userId="+userId) //default method falan yazmayınca GET çalışıyor sanırım denicem

    return fetchedBoughtOffers.json()
  }
  
  export async function fetchSoldOffersWithId(userId:string):Promise<SoldOffer[]> {
    const fetchedSoldOffers = await fetchData("/api/offers/fetchSoldOffersWithId/?userId="+userId) //default method falan yazmayınca GET çalışıyor sanırım denicem

    return fetchedSoldOffers.json()
  }
  //Notification için seenByseller ve buyyer 'ı true yapıyor
  export async function setSeenAllTrue():Promise<[SoldOffer]> {
    const fetchedSoldOffers = await fetchData("/api/offers/setSeenAllTrue") //default method falan yazmayınca GET çalışıyor sanırım denicem

    return fetchedSoldOffers.json()
  }
  //Deliver Order butonuna basınca offer credentials set ediyor
  export async function setSoldOfferCredentials(offerCredentials:SoldOfferForm, soldOfferId:string):Promise<SoldOffer> {
    const body={offerCredentials,soldOfferId}
    const response = await fetchData("/api/offers/setSoldOfferCredentials",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)

    })

    return response.json()
  }

  //EditRatingForm save butonuna basınca rating save ediyor
  export async function editSoldOfferRating(ratingData:SoldOfferEditRatingForm, soldOfferId:string) {
    const body={ratingData,soldOfferId}
    const response = await fetchData("/api/offers/editSoldOfferRating",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)

    })

    return response.json()
  }

  export async function setSoldOfferStage(offerStage:string, soldOfferId:string):Promise<SoldOffer> {
    const body={offerStage,soldOfferId}
    const response = await fetchData("/api/offers/setSoldOfferStage",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)

    })

    return response.json()
  }

//#region LOGIN LOGOUT SIGNUP  GETLOGGEDINUSER

  export interface LoginCredentials{
    username: string,
    password: string
  }

  export async function login(credentials:LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials)
    })
    return response.json()

  }

  export interface SignUpCredentials{
    username: string,
    email: string,
    password: string
  }

  export async function signUp(credentials:SignUpCredentials) {
    const response= await fetchData("/api/users/signup",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)


    })

    return response.json()
  }

  export async function logout() {
     await fetchData("/api/users/logout", {method:"POST"}  //logout controlde zaten res kısmında sadece status var json body yok
    )
  } 

  export async function getLoggedInUser() {
    const response = await fetchData("/api/users/", {method: "GET"})

    return response.json()
  }

  export async function fetchUsername(_id:string) {
    const response = await fetchData("/api/users/fetchUsername/?_id="+_id)
    return response.json()
  }

  export async function fetchUser(_id:string) {
    const response = await fetchData("/api/users/fetchUser/?_id="+_id)
    return response.json()
  }

  export async function getloggedInUserId() {
    const response = await fetchData("/api/users/getloggedInUserId")
    return response.json()
  }

  export async function fetchloggedInUser() {
    const response = await fetchData("/api/users/fetchloggedInUser")
    return response.json()
  }

  export async function fetchUserIdByUsername(username:string) {
    const response = await fetchData("/api/users/fetchUserIdByUsername/?username="+username+"")
    return response.json()
  }

  export async function setWritingTo(_id?:string) {
    const response = await fetchData("/api/users/setWritingTo/?_id="+_id+"")
    return response.json()
  }

  

//#endregion



