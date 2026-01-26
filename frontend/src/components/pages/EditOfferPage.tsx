import { Container } from "react-bootstrap"
import style from "../../styles/CreateOfferPage.module.css"
import LolAccountForm from "../serviceForms/Lol/LolAccountForm"
import LolBoostForm from "../serviceForms/Lol/LolBoostForm"
import LolCoachForm from "../serviceForms/Lol/LolCoachForm"
import LolRPForm from "../serviceForms/Lol/LolRPForm"
import ValorantAccountForm from "../serviceForms/Valorant/ValorantAccountForm"
import ValorantBoostForm from "../serviceForms/Valorant/ValorantBoostForm"
import ValorantCoachForm from "../serviceForms/Valorant/ValorantCoachForm"
import ValorantVPForm from "../serviceForms/Valorant/ValorantVPForm"
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import * as OffersApi from "../../network/offers_api"
import OfferForm from "../serviceForms/OfferForm"

const EditOfferPage = () => {

    const location = useLocation()
    // const searchParams = new URLSearchParams(location.search)
    
    const offer = location.state.offer
    // const offerId = location.state.id
    // const offerServiceName = location.state.serviceName
    // if(!offerId || !offerServiceName){
    //     throw new Error("offerId ya da serviceName yok")
    // }
    // //const {offer}= location.state //destructure kullanıyor direkt.
    // //const offer= location.state.offer //üsttekiyle aynı işlev
    
    // async function fetchOffer() {
    //     let fetchedOffer
    //     if(offerServiceName && offerId){
    //     fetchedOffer = await OffersApi.fetchOffer(offerServiceName, offerId)
    //     setOffer(fetchedOffer)
    //     }
    // }

    // useEffect(()=>{
    //     document.body.style.backgroundColor= "#FAFAFA"
    //     fetchOffer()
    // },[])
    // const [offer, setOffer] = useState<any>()


    return(
        <>
            <br/>
            {offer &&
            <Container>

                {<OfferForm
                offer={offer}
                categoryName={offer.categoryName}
                serviceName={offer.serviceName.slice(offer.categoryName.length)}/>}

                {/* {(offer.serviceName === "LolAccount") && 
                <LolAccountForm
                offer={offer}
                />
                } */}

            
            </Container>
            }
        </>
    )
}

export default EditOfferPage