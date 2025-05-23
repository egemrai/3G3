import { Card, CardBody } from "react-bootstrap";
import { SoldOffer } from "../models/SoldOffer";
import style from "../styles/UserProfilePage.module.css"

interface UserProfileRatingSoldOfferProps{
    offer: SoldOffer
}

export const UserProfileRatingSoldOffer = ({offer}:UserProfileRatingSoldOfferProps)=>{

    return(
        <>
            <Card className={`${style.ratingOfferCard}`}>
                <CardBody>
                    <p className={`${style.ratingOfferTitle}`}>Title: {offer.title}</p>
                    <p>Rating: {offer.sellerRating}</p>
                    {offer.sellerComment!=="" &&
                    <p>Comment: {offer.sellerComment}</p> }
                </CardBody>
                
            </Card>
            <p className={`${style.line}`}></p>
        </>
    ) 
}

export const UserProfileRatingBoughtOffer = ({offer}:UserProfileRatingSoldOfferProps)=>{


    return(
        <>
        <Card className={`${style.ratingOfferCard}`}>
                <CardBody>
                    <p className={`${style.ratingOfferTitle}`}>Title: {offer.title}</p>
                    <p>Rating: {offer.buyerRating}</p>
                    {offer.buyerComment!=="" &&
                    <p>Comment: {offer.buyerComment}</p> }
                </CardBody>
                
            </Card>
            <p className={`${style.line}`}></p>
        </>
    ) 
}