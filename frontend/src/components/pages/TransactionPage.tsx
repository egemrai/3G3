import { Link, useLocation, useNavigate } from "react-router-dom"
import style from "../../styles/TransactionPage.module.css"
import { Button, Card, Col, Container, Form, Modal, ModalBody, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import { SoldOffer, SoldOfferEditRatingForm, SoldOfferForm } from "../../models/SoldOffer"
import * as OffersApi from "../../network/offers_api"
import * as UsersApi from "../../network/offers_api"
import DetailsTransactionOffer from "../DetailsTransactionOffer"
import { useForm } from "react-hook-form"
import FormTransactionCredentials from "../FormTransactionCredentials"

const TransactionPage = ()=>{

    const navigate = useNavigate()
    const location = useLocation()

    const searchParams = new URLSearchParams(location.search)
    // const offerId = searchParams.get("id")
    const page = searchParams.get("page")

    const offerId= location.state.id
    console.log(offerId)

    useEffect(() => {
        if (!offerId) {
            navigate("/errorPage"); // rotaya / koyman daha iyi
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offerId]);

    const {register, handleSubmit, formState : {errors, isSubmitting}}  = useForm<SoldOfferForm>({mode: "all"})
    const {register:register2, handleSubmit:handleSubmit2, formState : {errors:errors2, isSubmitting:isSubmitting2}}  = useForm<SoldOfferEditRatingForm>({mode: "all"})

    async function setSoldOfferCredentials(credentials:SoldOfferForm){
        try {
            const response = await OffersApi.setSoldOfferCredentials(credentials,offer!._id)
            console.log(response)
             if(offer && response){
            setSoldOfferStage("ready")
            }
        } catch (error) {
            console.error(error)
            alert("submit button hata");
        }
    }

    async function editSoldOfferRating(ratingData:SoldOfferEditRatingForm){
        try {
            const response = await OffersApi.editSoldOfferRating(ratingData,offer!._id)
            if(response){
                alert("Edit saved")
            }
            console.log(response)
             
        } catch (error) {
            console.error(error)
            alert("save edit button hata");
        }
    }

    const [offer,setOffer] = useState<SoldOffer>() //soldOffer
    const [time, setTime] =useState <any>() //soldOffer oluşturulma saati için
    const [seller, setSeller] =useState <any>() //satıcı username için
    const [buyer, setBuyer] =useState <any>() //alıcı username için
    const [showDetails, setShowDetails] =useState<boolean>(false) //offerDetails modal göstermek için
    const [deliveryStage, setDeliveryStage] = useState<string>()//ilk başta true olsun,soldOffer.stage yap burayı, deliveryWaiting ise set ile false yap
    const [credentialsModalIndex, setCredentialsModalIndex] = useState<number|null> (null) //satıcı soldOffer credentials vermek için card'a tıklayınca hangi modal'in açılıp kapanacağı, alıcının card ve modal kısmı için de bunu kullanıcam çalışır sanırım
    const [currentPage, setCurrentPage] = useState<number> (1) // credentialts card sayfası
    const [userId,setUserId] = useState<string>() // şu anki kullanıcının userIdsi
    const [viewedButtonDisabled,setViewedButtonDisabled] = useState<boolean>(false)
    const [confirmedButtonDisabled,setConfirmedButtonDisabled] = useState<boolean>(false)
    const [preparingButtonDisabled,setPreparingButtonDisabled] = useState<boolean>(false)
    const [canceledButtonDisabled,setCanceledButtonDisabled] = useState<boolean>(false)
    const [showRatingModal,setShowRatingModal] = useState<boolean>(false)
    const [showEditRatingModal,setShowEditRatingModal] = useState<boolean>(false)
    const [showCancelModal,setShowCancelModal] = useState<boolean>(false)
    const [ratingRowIndex,setRatingRowIndex] = useState<number>(0)
    const [lastEditDate,setLastEditDate] = useState<JSX.Element>()
    const [editDateDiff,seEditDateDiff] = useState<number>()
    


    async function fetchUserId() {
        try {
            const response = await UsersApi.getloggedInUserId()
            setUserId(response)
        } catch (error) {
            alert("userId fetch error")
            console.error(error)
        }
    }

    async function fetchSoldOffer(_id:string) {
        try {
            //soldOffer fetch ve set kısmı
            const fetchedSoldOffer = await OffersApi.fetchSoldOfferWithId(_id)
            setOffer(fetchedSoldOffer)
            //soldoffer fetch edildikten sonra, createdAt'i time'a atama kısmı
            const fetchtime = new Date(fetchedSoldOffer.createdAt)
            setTime(fetchtime)
            //Son edit tarihinin jsxElement olarak hazırlanıp, set edildiği kısım
            const originalDate = new Date(fetchtime);
            originalDate.setMonth(originalDate.getMonth() + 1); //setMonth kullanırken ay'a 1 ekliyoruz

            const day = String(originalDate.getDate()).padStart(2, '0'); // padStart soldaki param, uzunluğu belirtiyor yani 01 10 12; sağdaki boşluğu ne ile dolduracağını, a kullansan a1 a5 falan gibi. String çevirme sebebi padStart numberda çalışmıyor
            const month = String(originalDate.getMonth() + 1).padStart(2, '0');// burda 1 eklememizin sebebi, js'de ay index'i 0dan başlıyor, ocak tarihini göstermek için 00 kullanıcak mesela, onu engellemek için görüntü amaçlı
            const year = originalDate.getFullYear();

            const formattedDate = `${day}/${month}/${year}`;
            setLastEditDate(<span>{formattedDate}</span>)
            //edit butonunu satış sonrası 1 ay geçmişse disable etme kısmı 
            const currentDate= new Date()
            seEditDateDiff(originalDate.getTime()-currentDate.getTime())
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


async function setSoldOfferStage(stage:string) {  // databasede soldOffer.stage değiştiriyor, if içinde f5 atmaya gerek kalmadan sayfada değiştiriyor
    try {
        const response = await OffersApi.setSoldOfferStage(stage,offer!._id)
        console.log(response)
        if(offer && response){
            const newOffer = offer
            newOffer.stage= stage
            setOffer(newOffer)
            setDeliveryStage(stage)
        }
    } catch (error) {
        console.error(error)
    }
}

//USEEFFECTLER
    useEffect(()=>{
        if(offerId){
            fetchSoldOffer(offerId)
        }
        if(page){
            setCurrentPage(Math.trunc(Number(page)))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        if(offer){
            if(!seller || !buyer){
                fetchUsernames()
            }
            if(!userId){
               fetchUserId() 
            }
            if(!deliveryStage)
            setDeliveryStage(offer?.stage)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[offer])

    //PAGE AYARLAMA VE CREDENTIALS GRID
    const offersPerPAge = 3
    const offersLenght = offer?.quantity
    const totalPages = Math.ceil(offersLenght!/offersPerPAge)
    const startIndex = (currentPage-1)* offersPerPAge

    const sellerCredentialsGrid = Array.from({length:offer?.quantity!},(_, i) =>{
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

    const buyerCredentialsGrid = offer?.offerCredentials.map((data,i)=>{
        return(
            <React.Fragment>
            <Col>
                <Card onClick={()=>setCredentialsModalIndex(i)}
                className={`${style.cardCredentials2}`}>
                    <Card.Title>{` ${offer.serviceName.replace(offer.categoryName,"")} #${i+1}`}</Card.Title>
                </Card>
            </Col>

            <Modal backdrop={true} show={credentialsModalIndex===i} onHide={()=>{setCredentialsModalIndex(null);console.log(credentialsModalIndex)}}> {/* onHide Modal dışına tıklayınca çalışan bir fonksiyon*/} 
            <Modal.Body className={`${style.modalForm}`}>
                <Modal.Title>
                    {i+1}. {offer?.serviceName.replace(offer.categoryName,"")} Credentials 
                </Modal.Title>

                                    {/* ACCOUNT İÇİN */}
                {offer.serviceName.replace(offer.categoryName,"") ==="Account" &&
                <>
                <Modal.Header/>
                <p className={`${style.infoP}`}>Account id: {data.accountId}</p>
                <p className={`${style.infoP}`}>Account password: {data.accountPassword}</p>
                <p className={`${style.infoLine}`}></p>
            
                <p className={`${style.infoP}`}>Email: {data.email}</p>
                <p className={`${style.infoP}`}>Email password: {data.emailPassword}</p>

                <p className={`${style.infoLine}`}></p>

                <p className={`${style.infoP}`}>Seller notes: {data.extraNotes}</p>
                </>}

                 {/* BOOST & COACH İÇİN */}
                 {(offer.serviceName.replace(offer.categoryName,"") ==="Coach" || 
                 offer.serviceName.replace(offer.categoryName,"") ==="Boost") &&
                 <>
                 <Form.Group className={`${style.formGroup}`} controlId={"orderConfirm"}>
                <Form.Label id="orderConfirm">{"Service delivered:"}</Form.Label>
                <Form.Select 
                    {...register(`offerCredentials.${i}.serviceConfirm`, {
                    required: "Required",
                    // setValueAs: (v) => v === "true", // string -> boolean dönüşümü
                    })}
                    
                    isInvalid={!!errors?.offerCredentials?.[i]?.serviceConfirm}>
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Form.Select>
                {errors?.offerCredentials?.[i]?.serviceConfirm?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.offerCredentials?.[i]?.serviceConfirm?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"extraNotes"}>
                <Form.Label id="extraNotes">{"Extra notes:"}</Form.Label>
                <Form.Control as={"textarea"}
                    {...register(`offerCredentials.${i}.extraNotes`, {
                    required: "Required",
                    })}
                    isInvalid={!!errors?.offerCredentials?.[i]?.extraNotes}
                />
                {errors?.offerCredentials?.[i]?.extraNotes?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.offerCredentials?.[i]?.extraNotes?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>
                 </>
                 }

                 {/* RP & VP İÇİN */}
                 {(offer.serviceName.replace(offer.categoryName,"") ==="RP" || 
                 offer.serviceName.replace(offer.categoryName,"") ==="VP") &&
                 <>
                 <Form.Group className={`${style.formGroup}`} controlId={"code"}>
                <Form.Label id="code">{"Code:"}</Form.Label>
                <Form.Control 
                    {...register(`offerCredentials.${i}.code`, {
                    required: "Required",
                    })}
                    isInvalid={!!errors?.offerCredentials?.[i]?.code}
                />
                {errors?.offerCredentials?.[i]?.code?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.offerCredentials?.[i]?.code?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"extraNotes"}>
                <Form.Label id="extraNotes">{"Extra notes:"}</Form.Label>
                <Form.Control className="whiteSpacePre" as={"textarea"} //whiteSpacePre dene 
                    {...register(`offerCredentials.${i}.extraNotes`, {
                    required: "Required",
                    })}
                    isInvalid={!!errors?.offerCredentials?.[i]?.extraNotes}
                />
                {errors?.offerCredentials?.[i]?.extraNotes?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.offerCredentials?.[i]?.extraNotes?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>
                 </>
                 }


            </Modal.Body>
        </Modal>
            </React.Fragment>
            
        )
        
    })

    

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
                    <div className={`${style.chat}`}>
                        <button onClick={()=> setShowRatingModal(true)} className={`${style.chatAndEditButton}`}>
                            View rating
                        </button>
                        <button className={`${style.chatAndEditButton}`}>
                            Chat
                        </button>
                    </div>
                    <div className={`${style.egem}`}>
                        <p className={`${style.chdeat}`}>{offer.stage}</p>
                        {offer.stage==="confirmed" && offer.buyerId===userId &&
                        <button
                        className={`${style.cancelButton}`}
                        disabled={canceledButtonDisabled}
                        
                        onClick={()=>setShowCancelModal(true)}>
                                Cancel
                        </button>}
                    </div>
                </div>
            {/*CANCEL MODAL*/}
            {showCancelModal && 
                <Modal show={true} onHide={()=>setShowCancelModal(false)}>
                    <Modal.Body>
                        <p>Are you sure to cancel the order?</p>
                        <Button className={`${style.editRatingSubmitButton}`} 
                        onClick={async()=>
                        {setCanceledButtonDisabled(true);
                        await setSoldOfferStage("canceled")
                        setShowCancelModal(false)
                        setCanceledButtonDisabled(false)}}>
                            Cancel order
                        </Button>
                    </Modal.Body>
                </Modal>
            }
           
            {/*VIEW RATING MODAL */}
            {showRatingModal &&
            <Modal  show={true} onHide={()=>setShowRatingModal(false)}>
                <ModalBody className={`${style.viewRatingModal}`}>
                    <Modal.Title> View rating</Modal.Title>
                    <Col  className={`${style.viewRatingCol}`}>
                        <Row as={Button} onClick={()=>setRatingRowIndex(0)} 
                            className={ratingRowIndex===0
                                ?`${style.viewRatingRowClicked} ${style.viewRatingRow}` 
                                :`${style.viewRatingRow}`
                            }
                            >
                            <span>Seller rating</span>
                        </Row>
                        <Row as={Button} onClick={()=>setRatingRowIndex(1)} 
                            className={ratingRowIndex===1
                                ?`${style.viewRatingRowClicked} ${style.viewRatingRow}` 
                                :`${style.viewRatingRow}`
                            }>
                            <span>Buyer rating</span>
                        </Row>
                    </Col>

                    {ratingRowIndex===0
                        ? <>
                          <p> {buyer.username}'s rating: {offer.sellerRating}</p>
                          <p> {buyer.username}'s comment: {offer.sellerComment}</p>
                          {userId===offer.buyerId &&
                          <div className={`${style.editButtonDiv}`}>
                            <p>You can only edit your rating once in a month after transaction. {lastEditDate}</p>
                            <Button className={`${style.openEditRatingModalButton}`} onClick={()=>setShowEditRatingModal(true)} disabled={offer.buyerEditedRating || editDateDiff! <0}>Edit</Button>
                          </div>}
                          </> 
                        : <>
                          <p> {seller.username}'s rating: {offer.buyerRating}</p>
                          <p> {seller.username}'s comment: {offer.buyerComment}</p>
                          {userId===offer.sellerId &&
                            <div className={`${style.editButtonDiv}`}>
                                <p>You can only edit your rating once in a month after transaction. {lastEditDate}</p>
                                <Button className={`${style.openEditRatingModalButton}`} onClick={()=>setShowEditRatingModal(true)} disabled={offer.sellerEditedRating || editDateDiff! <0}>Edit</Button>
                            </div>
                          }
                          </>
                          }
                </ModalBody>
            </Modal>}

            {/*VIEW RATING MODAL */}
            {showEditRatingModal &&
            <Modal show={true} onHide={()=>setShowEditRatingModal(false)}>
                <ModalBody className={`${style.viewEditRatingModal}`}>
                    <Modal.Title>Edit rating</Modal.Title>

            <Form onSubmit={handleSubmit2(editSoldOfferRating)}
                id="editRatingForm"
                >

                <Form.Group className={`${style.formGroup}`} controlId={"rating"}>
                <Form.Label id="rating">{"rating:"}</Form.Label>
                <Form.Select
                    {...register2(`rating`, {
                    required: "Required",
                    
                    })}
                    isInvalid={!!errors2?.rating}>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                </Form.Select> 
                {errors2?.rating?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors2?.rating.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"comment"}>
                <Form.Label id="comment">{"comment:"}</Form.Label>
                <Form.Control as={"textarea"}
                    {...register2(`comment`, {
                    required: "Required",
                    
                    })}
                    isInvalid={!!errors2?.comment}
                /> 
                {errors2?.comment?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors2?.comment.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Button className={`${style.editRatingSubmitButton}`}
                type="submit"
                disabled={isSubmitting2}>
                    Save
                </Button>
            </Form>        
                </ModalBody>
            </Modal>
            }
                
                {showDetails &&
                        <DetailsTransactionOffer
                        offer={offer}
                        onHide={()=>{setShowDetails(false)}}/>
                        }        
            </Card>
            
        </Container>
        <p className={`${style.line}`}></p>
        <Container>                         
            {offer.sellerId===userId &&   // alıcının deliver kısmına erişimini engellemek için
            <>
            {deliveryStage==="pending"&&
            <Card className={`${style.cardCredentials}`}>
                <Button className={`${style.prepareDelivery}`}
                disabled={preparingButtonDisabled}
                 onClick={async()=>
                    {setPreparingButtonDisabled(true);
                    await setSoldOfferStage("preparing")
                    setPreparingButtonDisabled(false)}}>Prepare delivery</Button>
            </Card>}

            {deliveryStage==="preparing"&&
            
                <Form onSubmit={handleSubmit(setSoldOfferCredentials)}
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
                            {sellerCredentialsGrid.length>0 && sellerCredentialsGrid}
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
                        disabled={isSubmitting}>
                            Deliver order
                        </Button>

                        {offer?.quantity &&
                        Array.from({length:offer.quantity}).flatMap((_,i)=>{
                            const errorMessageList:any = []
                            const egemuwu= errors?.offerCredentials?.[i]

                            if(errorMessageList.length===0){
                                if(egemuwu?.accountId||egemuwu?.accountPassword||egemuwu?.code||
                                    egemuwu?.email||egemuwu?.emailPassword||egemuwu?.serviceConfirm||egemuwu?.extraNotes){
                                        errorMessageList.push(
                                        <p key={`error${i+1}`} className={`text-danger ${style.errorMessage}`}> {` ${offer.serviceName.replace(offer.categoryName,"")}#${i+1} info missing`}</p>
                                )
                            }
                            }
                            

                            return(
                                errorMessageList
                            )
                        })
                        } {/* hata mesajı list sonu*/}
                    </Card>
                    
                </Form>
                }  {/* preparing sonu*/}
                </>} {/* sadece seller görebilir sonu*/}

                {deliveryStage==="ready" && offer.buyerId===userId &&
            <Card className={`${style.cardCredentials}`}>
                <Button className={`${style.prepareDelivery}`} 
                disabled={viewedButtonDisabled}
                onClick={async ()=>{
                    setViewedButtonDisabled(true)
                    await setSoldOfferStage("viewed")
                    setViewedButtonDisabled(false)}}>View delivery</Button>
            </Card>}
                
            {buyerCredentialsGrid && buyerCredentialsGrid.length>0 && (deliveryStage==="viewed"||deliveryStage==="confirmed") &&
             <Card className={`${style.cardCredentials}`}>
                <div className={`${style.modalFormDiv}`}>
                            <button 
                            disabled={currentPage<=1}
                            onClick={()=>setCurrentPage((x)=>x-1)}
                            className={`${style.cardCredentialsButton}`}>
                                {"<"}
                            </button>                   

                            <Row md={3} >
                            {buyerCredentialsGrid.length>0 && buyerCredentialsGrid}
                            </Row>

                            <button 
                            disabled={currentPage>=totalPages}
                            onClick={()=>setCurrentPage((x)=>x+1)}
                            className={`${style.cardCredentialsButton}`}>
                                {">"}
                            </button>
                        </div>
                        
                        
                        {offer.buyerId===userId && deliveryStage==="viewed" &&
                        <Button className={`${style.submitButton}`}
                            disabled={confirmedButtonDisabled}
                            onClick={async ()=>{
                            setConfirmedButtonDisabled(true)
                            await setSoldOfferStage("confirmed")
                            setConfirmedButtonDisabled(false)}}>  {/* satıcının buna ulaşamamasını sağla  VE setDisabled ile üstteki fonksiyon çalışınca true yap, bitiminde false yapmasan da olur heralde*/}
                            Confirm order
                        </Button>
                        }

                        
            </Card>} {/* buyerCredentialsGrid sonu*/}
            
             
        </Container>

         
        </>
        :<h3>Order Bulunamadı</h3>}


        
        </>
    )
}

export default TransactionPage