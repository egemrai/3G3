import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import * as OffersApi from "../../network/offers_api"
import { User as UserModel } from "../../models/user";
import { OfferSmall } from "../../models/offerSmall";
import OfferPage from "./OfferPage1";


interface OfferPage2Props{
    user: UserModel|null,
    socket:any
}

const OfferPage2 = ({user, socket}:OfferPage2Props) => {
    const location = useLocation()

    const searchParams = new URLSearchParams(location.search)
    const searchOfferId = searchParams.get("_id")
    const searchServiceName = searchParams.get("serviceName")
    if(!searchOfferId || !searchServiceName){
        throw new Error("url id ve serviceName yok")
    }
    //URL olmadan state ile veri göndermek için kullandım, search daha iyi sanırım, state kullanınca f5 atıldığında veriler yüklenmiyor gibi
    //const offer = location.state.offerSmall
    //URLDEN Gelen data ile search kullanarak yapmaya karar verdim
  
    const [offer, setOffer] = useState<OfferSmall|null>(null)

    async function fetchOffer(){
            try {
                if(!searchServiceName || !searchOfferId) throw Error
                const fetchedOffer = await OffersApi.fetchOffer(searchServiceName,searchOfferId)
                if(fetchedOffer)
                setOffer(fetchedOffer)
            } catch (error) {
                console.error(error)
            }
        }
    
        useEffect(()=>{
            document.body.style.backgroundColor= "#FAFAFA"
            fetchOffer()
        },[])
        
    return (
        <>
            {offer!==null &&
                <OfferPage
                socket={socket}
                offer={offer}
                user={user}/>
            }
        </>

    );
}



export default OfferPage2;