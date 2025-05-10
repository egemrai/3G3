import { Link, useLocation, useNavigate } from "react-router-dom"
import style from "../../styles/TransactionPage.module.css"
import { Button, Card, Container, Form, Modal, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import { SoldOffer, SoldOfferForm } from "../../models/SoldOffer"
import * as OffersApi from "../../network/offers_api"
import * as UsersApi from "../../network/offers_api"
import DetailsTransactionOffer from "../DetailsTransactionOffer"
import { useForm } from "react-hook-form"
import FormTransactionCredentials from "../FormTransactionCredentials"

const TransactionPage = ()=>{

    const navigate = useNavigate()

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const offerId = searchParams.get("id")
    const page = searchParams.get("page")

    useEffect(() => {
        if (!offerId) {
            navigate("/errorPage"); // rotaya / koyman daha iyi
        }
    }, [offerId]);


    if(!offerId){
        navigate("errorPage")
    }

    const [offer,setOffer] = useState<SoldOffer>() //soldOffer
    const [time, setTime] =useState <any>() //soldOffer oluşturulma saati için
    const [seller, setSeller] =useState <any>() //satıcı username için
    const [buyer, setBuyer] =useState <any>() //alıcı username için
    const [showDetails, setShowDetails] =useState<boolean>(false) //offerDetails modal göstermek için
    const [deliveryStarted, setDeliveryStarted] = useState<boolean>(false)//ilk başta true olsun,soldOffer.stage yap burayı, deliveryWaiting ise set ile false yap
    const [credentialsModalIndex, setCredentialsModalIndex] = useState<number|null> (null) //satıcı soldOffer credentials vermek için card'a tıklayınca hangi modal'in açılıp kapanacağı
    const [currentPage, setCurrentPage] = useState<number> (1) // credentialts card sayfası


    async function fetchSoldOffer(_id:string) {
        try {
            const fetchedSoldOffer = await OffersApi.fetchSoldOfferById(_id)
            setOffer(fetchedSoldOffer)
            const fetchtime = new Date(fetchedSoldOffer.createdAt)
            setTime(fetchtime)
            
        } catch (error) {
            console.error(error)
        }
    }

    async function fetchUsernames() {
        if(offer){
            const [seller,buyer]= await Promise.all([
                await UsersApi.fetchUsername(offer.sellerId),
                await UsersApi.fetchUsername(offer.buyerId)
            ])
            if(seller && buyer){
                setSeller(seller)
                setBuyer(buyer)
            }
        }  
    }

    useEffect(()=>{
        if(offerId){
            fetchSoldOffer(offerId)
        }
        if(page){
            setCurrentPage(Math.trunc(Number(page)))
        }
    },[])

    useEffect(()=>{
        if(offer)
            fetchUsernames()
        
    },[offer])

    const {register, handleSubmit, formState : {errors, isSubmitting}}  = useForm<SoldOfferForm>({mode: "all"})

     function teste(credentials:SoldOfferForm){
        alert("form gönderildi");
        console.log("ege")
        console.log(credentials)
        
    }


    const offersPerPAge = 3
    const offersLenght = offer?.quantity
    const totalPages = Math.ceil(offersLenght!/offersPerPAge)
    const startIndex = (currentPage-1)* offersPerPAge

    const credentialsGrid = Array.from({length:offer?.quantity!},(_, i) =>{
        return(
            <FormTransactionCredentials
            key={i}
            register={register}
            i={i}
            offer={offer!} //burdaki ünlem şüpheli, empty array atabilir diye düşünmüştüm
            errors={errors}
            setCredentialsModalIndex={setCredentialsModalIndex}
            credentialsModalIndex={credentialsModalIndex}
            />
        )
    }).slice(startIndex,startIndex+ offersPerPAge)

    


    return(
        <>
        {offer&&seller&&buyer
        ?<>
        <Container>
            <Card className={style.card}>
                <div className={style.offerDiv}>
                    <div className={`${style.whiteSpacePre}`}>{`Order id:  ${offer._id}   /   Sold on: ${time.toLocaleString()}`}</div>
                    
                </div>
                <div className={`${style.cardDiv}`}>
                    <div className={style.titleDiv}>
                        <p  className={style.title}>{offer.title}</p>
                        <p className={style.idServiceP}>{`${offer.categoryName +"-"+ offer.serviceName.replace(offer.categoryName,"") }`}</p>
                            <div className={`${style.underTitleDiv}`}>
                                <div className={`${style.soldByDiv}`}>
                                    <span>Sold by: </span>
                                    <Link to={"/profile/"+seller.username}>{seller.username}</Link>
                                </div>
                                <Button className={`${style.orderDetails}`} onClick={()=>setShowDetails(true)}>Order details</Button>
                                <div className={`${style.soldByDiv}`}>
                                    <span>Bought by: </span>
                                    <Link to={"/profile/"+buyer.username}>{buyer.username}</Link>
                                </div>
                                
                                <p className={`${style.quantity}`}>Quantity: x{offer.quantity}</p>
                            </div>
                            
                        
                    </div>
                    <div className={`${style.chat}`}>{`Total: ${offer.totalAmount + " "+ offer.currency}`}</div>
                    <div className={`${style.chat}`}>CHAT</div>
                    <div className={`${style.chat}`}>{offer.stage}</div>
                </div>
                
                    
                
                {showDetails &&
                        <DetailsTransactionOffer
                        offer={offer}
                        onHide={()=>{setShowDetails(false)}}/>
                        }
            </Card>
            
        </Container>
        <p className={`${style.line}`}></p>
        <Container>
            {!deliveryStarted&&
            <Button onClick={()=>setDeliveryStarted(true)}>Start Delivery</Button>}

            {deliveryStarted&&
            
                <Form onSubmit={handleSubmit(teste)}
                id="credentialsSubmit"
                >
                    <Card className={`${style.cardCredentials}`}>
                        <div className={`${style.modalFormDiv}`}>
                            <button 
                            disabled={currentPage<=1}
                            onClick={()=>setCurrentPage((x)=>x-1)}
                            className={`${style.cardCredentialsButton}`}>
                                {"<"}
                            </button>                   

                            <Row md={3} >
                            {credentialsGrid.length>0 && credentialsGrid}
                            </Row>

                            <button 
                            disabled={currentPage>=totalPages}
                            onClick={()=>setCurrentPage((x)=>x+1)}
                            className={`${style.cardCredentialsButton}`}>
                                {">"}
                            </button>
                        </div>
                        
                        


                        <Button className={`${style.submitButton}`}
                        type="submit"
                        disabled={false}>
                            Deliver order
                        </Button>
                    </Card>
                    
                </Form>
                
                
                }
        </Container>
        

        </>
        :<h3>Order Bulunamadı</h3>}

        
        </>
    )
}

export default TransactionPage