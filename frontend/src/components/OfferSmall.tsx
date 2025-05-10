import { Button, Card, CardBody, CardTitle } from "react-bootstrap"
import { OfferSmall as offerSmallModel } from "../models/offerSmall"
import OfferSmallDetails from "./OfferSmallDetails"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import style from "../styles/OfferSmall.module.css"

interface OfferSmallProps{
offerSmall: offerSmallModel
}



 const OfferSmall = ({offerSmall}:OfferSmallProps) => {

    const {title, price, currency, description, server,_id,serviceName, categoryName, sellerId, sellerUsername } = offerSmall
    //sellerUsername default offer datasında yok, backendde offer'ı fetch ederken offer["sellerUsername"] ekleyip ediyorum

    const [showDetails, setShowDetails] = useState(false)

    const navigate = useNavigate()

    const seeOffer = () => {
        if (showDetails) return //modal açıldıktan sonra yine de linke yollamasını engellemek için, onClick'te e.stopPropagation() ile linke gitmeden modal açılmasını sağlayabiliyoruz
        document.body.style.cursor = "auto"
        navigate("/offer/?_id=" +_id+ "&serviceName="+serviceName+"",{state:{offerSmall: offerSmall}})
    }

    const [hovered, setHovered] = useState(false)

    useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    

    return (
        <>
        
            <Card className={`${style.card}`}
                onPointerOver={() => setHovered(true)}  //mouse hover pointer için
                onPointerOut={() => setHovered(false)}
                onClick={seeOffer} >
                  
                <CardBody className={`${style.cardBody}`}>
                    <CardTitle className={`${style.cardTitle}`}>
                        <div className={`${style.cardTitleDiv}`}>  
                            <p className={`${style.title}`}>{title}</p>
                            <p className={`${style.price}`}> {price + " " +currency}</p>
                            <div className={`${style.seller_iDiv}`}>
                                <p className={`${style.sellerName}`}> {sellerUsername}</p>
                                <Button className={`${style.detailsButton}`} 
                                    onClick={(e)=>{
                                        document.body.style.cursor = 'auto'
                                        setShowDetails(true)
                                        e.stopPropagation()}
                                        }>
                                    i
                                </Button>
                            </div>
                        </div>
                    </CardTitle>
                    
                
                
                {showDetails &&
                    <OfferSmallDetails
                        closeDetails={()=>{setShowDetails(false)}}
                        description={description}
                        server={server}
                    />
                }    
                    
                </CardBody>
                
            </Card>
            
        </>
    )
} 

export default OfferSmall