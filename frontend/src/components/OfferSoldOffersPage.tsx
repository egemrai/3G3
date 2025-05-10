import { Button, Card} from "react-bootstrap"
import style from "../styles/OfferSoldOffersPage.module.css"
import { Link, useNavigate } from "react-router-dom"
import * as services_api from "../network/serviceForm_api"
import { SoldOffer } from "../models/SoldOffer"


interface Offer_SoldOffersPageProps{
    offer:SoldOffer
}

const Offer_SoldOffersPage = ({offer}:Offer_SoldOffersPageProps) => {

    const time = new Date(offer.createdAt)
    
    return ( 
    <>
        <Card className={style.card}>
            <div className={style.offerDiv}>
                <div className={`${style.whiteSpacePre}`}>{`Order id:  ${offer._id}   /   Sold on: ${time.toLocaleString()}`}</div>
                
            </div>
            <div className={`${style.cardDiv}`}>
                <div className={style.titleDiv}>
                    <Link to={"/transaction/?id="+ offer._id+"&page=1"} className={style.title}>{offer.title}</Link>
                    <p className={style.idServiceP}>{`${offer.categoryName +"-"+ offer.serviceName.replace(offer.categoryName,"") }`}</p>
                </div>
                <div >{`total: ${offer.totalAmount + " "+ offer.currency}`}</div>
                <div >{offer.stage}</div>
            </div>
            <p className={`${style.quantity}`}>x{offer.quantity}</p>
                
            
        </Card>
    </>
    )
}

export default Offer_SoldOffersPage