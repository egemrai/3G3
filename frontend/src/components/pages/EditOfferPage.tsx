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

const EditOfferPage = () => {

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    
    const offerId = searchParams.get("_id")
    const offerServiceName = searchParams.get("serviceName")
    if(!offerId || !offerServiceName){
        throw new Error("offerId ya da serviceName yok")
    }
    //const {offer}= location.state //destructure kullanıyor direkt.
    //const offer= location.state.offer //üsttekiyle aynı işlev
    
    async function fetchOffer() {
        let fetchedOffer
        if(offerServiceName && offerId){
        fetchedOffer = await OffersApi.fetchOffer(offerServiceName, offerId)
        setOffer(fetchedOffer)
        }
    }

    useEffect(()=>{
        fetchOffer()
    },[])
    const [offer, setOffer] = useState<any>()


    return(
        <>
            <br/>
            {offer &&
            <Container>

                {(offer.serviceName === "LolAccount") && 
                <LolAccountForm
                offer={offer}
                />
                }

                {(offer.serviceName === "LolBoost") && 
                <LolBoostForm
                offer={offer}
                />
                }

                {(offer.serviceName === "LolCoach") && 
                <LolCoachForm
                offer={offer}
                />
                }

                {(offer.serviceName === "LolRP") && 
                <LolRPForm
                offer={offer}
                />
                }

                {(offer.serviceName === "ValorantAccount") && 
                <ValorantAccountForm
                offer={offer}
                />
                }

                {(offer.serviceName === "ValorantBoost") && 
                <ValorantBoostForm
                offer={offer}
                />
                }

                {(offer.serviceName === "ValorantCoach") && 
                <ValorantCoachForm
                offer={offer}
                />
                }

                {(offer.serviceName === "ValorantVP") && 
                <ValorantVPForm
                offer={offer}
                />
                }

                <Container className= {`${style.categoryContainer}`} >
                    <p>title: {offer.title}</p>

                </Container>

            
            </Container>
            }
        </>
    )
}

export default EditOfferPage