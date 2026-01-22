import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as OffersApi from "../../network/offers_api"
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import style from "../../styles/OfferPage.module.css"
import {  useForm } from "react-hook-form";
import { User as UserModel } from "../../models/user";
import { OfferSmall } from "../../models/offerSmall";

interface Buyform{
    buyAmount:number
}

interface OfferPageProps{
    user: UserModel|null,
    offer:OfferSmall,
    socket: any
}

const OfferPage1 = ({user, offer, socket}:OfferPageProps) => {
    const navigate = useNavigate()

    
        const {title, price, currency, description, server,_id:offerId,serviceName,
    categoryName, sellerId:satıcınınId, sellerUsername:satıcıUsername, deliveryTime, stock, updatedAt } = offer


    const {handleSubmit,
           register,
           setValue,
           getValues,
           watch,
           formState:{isSubmitting, errors}} = useForm<Buyform>({mode:"all", defaultValues:{
               buyAmount: 1
           }})

    let buyAmount = watch("buyAmount")
    const [buyButton, setBuyButton] = useState<boolean>(false) //satıcı kendi ürün sayfasına gelirse chat ve buy butonu disable için
    const [totalAmount, setTotalAmount] = useState<number>(price)
        
    useEffect(()=>{
        if(user?.username===satıcıUsername || user===null){
            setBuyButton(true)
        }
        
    },[user])

    
    const buyOffer = async(credentials:any)=>{
        try {
            const fetchedOffer = await OffersApi.fetchOffer(serviceName,offerId)
            const date2 =new Date(fetchedOffer.updatedAt)
            console.log(date2.toLocaleString())

            if(updatedAt===fetchedOffer.updatedAt){
                console.log("offer editlenmemiş")
                const soldOfferBody = {...offer,...credentials}
                const createdSoldOffer= await OffersApi.createSoldOffer(soldOfferBody)
                console.log(createdSoldOffer)
            }else{
                console.log("error")
            }
        } catch (error) {
            console.error(error)
        }     
    }
    
    const goChatPage = ()=>{
        navigate("/chat", {state:{chatReceiverId:satıcınınId}})
    }

    //DELIVERY TIME ve DURATION AYARLAMA KISMI
    const deliveryTimeTable:Record<number,string >= {  //js keyleri otomatik string yapıyor sanırım ama yine de çalışıyor
        0.16: "10min", 0.32: "20min", 0.48: "30min", 0.64: "40min", 0.80: "50min", 1: "1h", 2:"2h", 3: "3h",
        4: "4h", 5: "5h", 6: "6h", 7: "7h", 8: "8h", 9: "9h", 10: "10h", 11: "11h", 12: "12h", 13: "13h",
        14: "14h", 15: "15h", 16: "16h", 17: "17h", 18: "18h", 19: "19h", 20: "20h", 21: "21h", 22: "22h",
        23: "23h", 24: "24h", 25: "25h", 26: "26h", 27: "27h", 28: "28h", 29: "29h", 30: "30h", 31: "31h",
        32: "32h", 33: "33h", 34: "34h", 35: "35h", 36: "36h", 37: "37h", 38: "38h", 39: "39h", 40: "40h",
        41: "41h", 42: "42h", 43: "43h", 44: "44h", 45: "45h", 46: "46h", 47: "47h", 48: "48h", 49: "49h",
        50: "50h", 51: "51h", 52: "52h", 53: "53h", 54: "54h", 55: "55h", 56: "56h", 57: "57h", 58: "58h",
        59: "59h", 60: "60h", 61: "61h", 62: "62h", 63: "63h", 64: "64h", 65: "65h", 66: "66h", 67: "67h",
        68: "68h", 69: "69h", 70: "70h", 71: "71h", 72: "72h"
    }
    const editedDeliveryTime = deliveryTimeTable[deliveryTime]

    const dura:Record<number, string>= {
        7: "7days",
        14: "14days",
        30: "30days"
    }
    const editedDuration= dura[offer.duration]

//#region INFO COMPONENTLAR
    //BİR DÜNYA COMPONENT İLE UĞRAŞMAMAK İÇİN DİREKT BU FILE İÇİNDE OFFER INFOLARI TANIMLICAM
    //#region LOL
    const LolAccount =
        <>
            <Row xl={2} className={`${style.forEveryOfferInfo}`}>
                <Col><p>{"Skins ---> " + offer.skins}</p></Col>
                <Col><p>{"Champions ---> " +offer.champions}</p></Col>
                <Col><p>{"Server ---> "+ server}</p></Col>
                <Col><p>{"Rank ---> "+offer.rank}</p></Col>
                <Col><p>{"Stock ---> "+stock}</p></Col>
                <Col><p>{"Delivery time ---> "+ editedDeliveryTime}</p></Col>
                
            </Row>
        </>

    const LolBoost = 
    <>
        <Row xl={2} className={`${style.forEveryOfferInfo}`}>
            <Col><p>{"Service type ---> " + offer.serviceType}</p></Col>
            <Col><p>{"Duration ---> " +editedDuration}</p></Col>
            <Col><p>{"Server ---> "+ server}</p></Col>
            <Col><p>{"Rank ---> "+offer.desiredRank}</p></Col>
            <Col><p>{"Stock ---> "+stock}</p></Col>
            <Col><p>{"Delivery time ---> "+ editedDeliveryTime}</p></Col>
            
        </Row>
    </>

    const LolCoach  =
    <>
        <Row xl={2} className={`${style.forEveryOfferInfo}`}>
            <Col><p>{"Duration ---> " +editedDuration}</p></Col>
            <Col><p>{"Server ---> "+ server}</p></Col>
            <Col><p>{"Rank ---> "+offer.rank}</p></Col>
            <Col><p>{"Stock ---> "+stock}</p></Col>
            <Col><p>{"Delivery time ---> "+ editedDeliveryTime}</p></Col>
            
        </Row>
    </>

    const LolRP =
    <>
        <Row xl={2} className={`${style.forEveryOfferInfo}`}>
            <Col><p>{"Server ---> "+ server}</p></Col>
            <Col><p>{"Stock ---> "+stock}</p></Col>
            <Col><p>{"Delivery time ---> "+ editedDeliveryTime}</p></Col>
            <Col><p>{"RP ---> "+ offer.value}</p></Col>
            
        </Row>
    </>
    //#endregion

    //#region VALORANT
    const ValorantAccount =
        <>
            <Row xl={2} className={`${style.forEveryOfferInfo}`}>
                <Col><p>{"Skins ---> " + offer.skins}</p></Col>
                <Col><p>{"Agents ---> " +offer.agents}</p></Col>
                <Col><p>{"Server ---> "+ server}</p></Col>
                <Col><p>{"Rank ---> "+offer.rank}</p></Col>
                <Col><p>{"Stock ---> "+stock}</p></Col>
                <Col><p>{"Delivery time ---> "+ editedDeliveryTime}</p></Col>
                
            </Row>
        </>

    const ValorantBoost = 
    <>
        <Row xl={2} className={`${style.forEveryOfferInfo}`}>
            <Col><p>{"Service type ---> " + offer.serviceType}</p></Col>
            <Col><p>{"Duration ---> " +editedDuration}</p></Col>
            <Col><p>{"Server ---> "+ server}</p></Col>
            <Col><p>{"Rank ---> "+offer.desiredRank}</p></Col>
            <Col><p>{"Stock ---> "+stock}</p></Col>
            <Col><p>{"Delivery time ---> "+ editedDeliveryTime}</p></Col>
            
        </Row>
    </>

    const ValorantCoach = 
    <>
        <Row xl={2} className={`${style.forEveryOfferInfo}`}>
            <Col><p>{"Duration ---> " +editedDuration}</p></Col>
            <Col><p>{"Server ---> "+ server}</p></Col>
            <Col><p>{"Rank ---> "+offer.rank}</p></Col>
            <Col><p>{"Stock ---> "+stock}</p></Col>
            <Col><p>{"Delivery time ---> "+ editedDeliveryTime}</p></Col>
            
        </Row>
    </>

    const ValorantVP = 
        <>
            <Row xl={2} className={`${style.forEveryOfferInfo}`}>
                <Col><p>{"Server ---> "+ server}</p></Col>
                <Col><p>{"Stock ---> "+stock}</p></Col>
                <Col><p>{"Delivery time ---> "+ editedDeliveryTime}</p></Col>
                <Col><p>{"VP ---> "+ offer.value}</p></Col>
            </Row>
        </>
    //#endregion
//#endregion
           
    
    return (
        <>
            <Container>
                <div className={`${style.navigateDiv}`}>
                            <button className={`${style.homeButton}`}  onClick={()=>{navigate("/")}}>Home</button>
                            <p className={`${style.navigateArrow}`}>{" >"}</p>
                            <button className={`${style.homeButton}`} onClick={()=>{navigate("/category/"+offer.categoryName)}}>{categoryName}</button>
                            <p className={`${style.navigateArrow}`}>{" >"}</p>
                            <button className={`${style.homeButton}`} onClick={()=>{navigate("/category/"+offer.categoryName+"/"+serviceName.replace(categoryName,"")+"/?page=1")}}>{`${serviceName.replace(categoryName,"")}`}</button>
                </div>

                <div className={`${style.info_BuyDiv}`}>
                    <div className={`${style.infoDiv}`}>
                        
                        <div className={`${style.offer}`}>
                            <h2 >{title}</h2>
                            <h4 className={`${style.title}`}>Offer info</h4>
                            <div className={`${style.offerInfo}`}>
                                    {/* LOL OFFER INFO*/}
                                {offer.serviceName==="LolAccount" && LolAccount}
                                {offer.serviceName==="LolBoost" && LolBoost}
                                {offer.serviceName==="LolCoach" && LolCoach}
                                {offer.serviceName==="LolRP" && LolRP}
                                    {/* VALORANT OFFER INFO*/}
                                {offer.serviceName==="ValorantAccount" && ValorantAccount}
                                {offer.serviceName==="ValorantBoost" && ValorantBoost}
                                {offer.serviceName==="ValorantCoach" && ValorantCoach}
                                {offer.serviceName==="ValorantVP" && ValorantVP}
                            </div>
                            <p className={`${style.description}`}>{description}</p>
                        </div>
                    </div>

                    <div className={`${style.priceDiv}`}>


                        {(offer.serviceName.replace(`${offer.categoryName}`,"")==="Account") &&
                        <div className={`${style.insuranceDiv}`}>
                            <p>Free insurance </p>
                            <p> 14 days</p>
                        </div>
                        }

                            <div className={`${style.amountDiv}`}>
                                <p className={`${style.available}`}> {offer.stock} available</p>
                                <div className={`${style.amountButtonDiv}`}>
                                    <button
                                    onClick={()=>{
                                        const currentAmount = getValues("buyAmount")
                                        if(currentAmount===1){
                                            setValue("buyAmount", 1)
                                        }else{
                                            setValue("buyAmount", currentAmount-1)
                                            setTotalAmount((currentAmount-1)*price)
                                        }
                                        }}
                                    disabled={buyAmount===1}
                                    className={`${style.amountLeftButton}`}
                                    >
                                        <p className={`${style.amountLeftButtonP}`}>-</p>
                                    </button>
                                    <Form
                                        id="buyForm"
                                        onSubmit={handleSubmit(buyOffer)}></Form>
                                        <Form.Control
                                            className={`${style.amountP}`}
                                            {...register("buyAmount",
                                            {required:"Required",
                                            valueAsNumber: true,
                                            validate:(value)=>{
                                                if (!Number.isInteger(value) || value < 1 || value > offer.stock) {
                                                    return "Only numbers between 1 and 9999 are allowed";
                                                  }
                                                  return true;
                                            }
                                            })}
                                            onChange={(e) => {
                                                if(!/^[1-9][0-9]{0,9}$/.test(e.target.value) ){
                                                    e.preventDefault()
                                                    setValue("buyAmount",1)
                                                    setTotalAmount(price)}
                                                else if(parseInt(e.target.value)>offer.stock){
                                                    e.preventDefault()
                                                    setValue("buyAmount",offer.stock)
                                                    setTotalAmount(price*offer.stock)}
                                                else(
                                                    setTotalAmount(price*Number(e.target.value))
                                                )
                                                    //alt kısım onBeforeInput ve onInput denedim ordan kalma
                                                    const input = e as React.FormEvent<HTMLInputElement> //BU VE ALTTAKİ SATIR KARIŞIK, e ile currentTarget ve onBeforeInput kullanabilmek için sanırım, alt satırdaki de basılan tuşun datasını almak için. data tek karakter verisi döndürüyor. "e" "3" gibi
                                                    const nextValue = input.currentTarget.value + (e.nativeEvent as InputEvent).data;
                                                    const input2 = e as React.ChangeEvent<HTMLInputElement>
                                            }}
                                                //input.currentTarget.value= "1"
                                                 // input2.target.value= "1"  
                                        />

                                    <button className={`${style.amountRightButton}`}
                                    onClick={()=>{
                                        const currentAmount = getValues("buyAmount")
                                        setValue("buyAmount", currentAmount+1)
                                        setTotalAmount((currentAmount+1)*price)}}
                                    disabled={buyAmount>= offer.stock }
                                    >
                                        <p className={`${style.amountRightButtonP}`}>+</p>
                                    </button>
                                    
                                </div>
                                <p className={`${style.available}`}> Unit Price: {offer.price} {offer.currency}</p>
                            </div>

                            <div className={`${style.buyDiv}`}>
                                <div className={`${style.price1}`}>
                                    <p className={`${style.priceSpan}`}>Total amount:</p>
                                    <p className={`${style.priceSpan}`}>{totalAmount} {currency}</p>
                                </div>

                                <Button
                                type="submit"
                                form="buyForm"
                                disabled={buyButton||isSubmitting}
                                className={`${style.buyButton}`}>
                                    Buy Now
                                </Button>
                            </div>


                        <div className={`${style.buyDiv}`}>
                            <p className={`${style.priceSpan}`}>95.42% | 0 Sold</p>
                            <p> offer ID: {offerId}</p>
                            <span className={`${style.border} border-top d-block`}></span>

                            <div className={`${style.annen}`}>
                                <button onClick={()=>navigate("/profile/"+satıcıUsername)}
                                    className={`${style.sellerButton}`}>seller: {satıcıUsername}</button>
                                <Button className={`${style.chatButton}`}
                                disabled={buyButton}
                                onClick={()=>
                                    goChatPage()
                                }>Chat</Button>
                            </div>
                        </div>

                    </div>
                </div>

            </Container>

        </>

    );
}



export default OfferPage1;