//resolver error falan onları belki prop olarak gösterip createOfferPage'de değer atamak gerekir.

import { useForm } from "react-hook-form"
import {LolRPCredentials} from "../../../network/serviceForm_api"
import { Button, Container, Form } from "react-bootstrap"
import style from "../../../styles/CreateOfferForm.module.css"
import * as serviceForm_api from "../../../network/serviceForm_api"
import { useNavigate } from "react-router-dom"
import { LolRP as LolRPOfferModel} from "../../../models/offers/LolOfferModels"
import { useEffect, useRef, useState } from "react"

interface LolRPFormProps{
    offer?: LolRPOfferModel
}

const LolRPForm= ({offer}:LolRPFormProps)=>{

    const {register, handleSubmit, formState : {errors, isSubmitting}}  = useForm<LolRPCredentials>({mode: "all",
        defaultValues:{
            title: offer?.title || "",
            description: offer?.description || "",
            server: offer?.server || "",
            price: offer?.price ?? undefined,
            currency: offer?.currency || "",
            deliveryTime: offer?.deliveryTime ?? undefined,
            stock: offer?.stock ?? undefined,
        }})

    const navigate = useNavigate()

    const onSubmit = async(credentials:LolRPCredentials) => {
        if(offer){
            const currentTime = new Date()
            const offerTime = new Date(offer.updatedAt)
            if(Math.trunc((currentTime.getTime()-offerTime.getTime())/1000)>editDelayTime){
                const editIdData = {sellerId:offer.sellerId, _id: offer._id}
                await serviceForm_api.editLolRPOffer(credentials,editIdData)
                navigate("/manageOffer")
            }else{
                alert("2 edit arasında 5 dk bekle")
            }
        }
        else{
            await serviceForm_api.createLolRPOffer(credentials)
            navigate("/manageOffer")
        }
    }

    let [timeDiff, setTimeDiff] = useState<number>()
    const [editButtonActive, setEditButtonActive] = useState<boolean>()
    const editDelayTime = 10

    function reduceTimer(){
        if(timeDiff)
        setTimeDiff(xd => xd as number-1) //useStatede set() içine random bir şey yazınca en son güncel değeri alıyormuş sanırım, timeDiff'ten daha güncel olabilir bilmiyorum
    }

    useEffect(()=>{
        if(offer){
            const currentTime = new Date()
            const offerTime = new Date(offer.updatedAt)
            if(Math.trunc((currentTime.getTime()-offerTime.getTime())/1000)<editDelayTime){
                setEditButtonActive(true)
                setTimeDiff(editDelayTime-Math.trunc((currentTime.getTime()-offerTime.getTime())/1000))
            }else{
                setEditButtonActive(false)
            }
            
        }
    },[])
    
    const intervalRef = useRef<any> (null) // NodeJS.Timeout

    useEffect(()=>{
         intervalRef.current  = setInterval(reduceTimer,1000)
    },[offer])
    
    useEffect(()=>{
        if((timeDiff===0 || timeDiff as number <0) && intervalRef.current){
            clearInterval(intervalRef.current )
            setEditButtonActive(false)
        }
    },[timeDiff])
    
    return (

        <Container className={`${style.container}`}>
            <p className={`${style.formTitle}`}>Lol RP Form</p>
            <Form onSubmit={handleSubmit(onSubmit)}
            id="createLolRPForm"
            >
                <Form.Group className={`${style.formGroup}`} controlId={"title"}>
                    <Form.Label id="title">{"title"}</Form.Label>
                        <Form.Control 
                        {...register("title",{
                            required:"Required"
                            })
                        }
                        isInvalid={!!errors?.title}
                        />
                    <Form.Control.Feedback type="invalid">
                        {errors?.title?.message}
                    </Form.Control.Feedback>     
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"description"}>
                    <Form.Label id="description">{"description"}</Form.Label>
                        <Form.Control as={"textarea"}
                        {...register("description",{
                            required:"Required"
                            })
                        }
                        isInvalid={!!errors?.description}
                        />
                    <Form.Control.Feedback type="invalid">
                        {errors?.description?.message}
                    </Form.Control.Feedback>     
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"server"}>
                    <Form.Label id="server">{"server"}</Form.Label>
                        <Form.Select {...register("server",{required:"Required"})} isInvalid={!!errors?.server}>
                            <option value="EUW">EUW</option> {/* EU West */}
                            <option value="EUNE">EUNE</option> {/* EU Nordic & East */}
                            <option value="NA">NA</option> {/* North America */}
                            <option value="KR">KR</option> {/* Korea */}
                            <option value="LAN">LAN</option> {/* Latin America North */}
                            <option value="LAS">LAS</option> {/* Latin America South */}
                            <option value="BR">BR</option> {/* Brazil */}
                            <option value="OCE">OCE</option> {/* Oceania */}
                            <option value="JP">JP</option> {/* Japan */}
                            <option value="RU">RU</option> {/* Russia */}
                            <option value="TR">TR</option> {/* Turkey */}
                            <option value="PH">PH</option> {/* Philippines */}
                            <option value="TH">TH</option> {/* Thailand */}
                        </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors?.server?.message}
                    </Form.Control.Feedback>     
                </Form.Group>

                


                <Form.Group className={`${style.formGroup}`} controlId={"price"}>
                    <Form.Label id="price">{"price"}</Form.Label>
                        <Form.Control
                        
                        {...register("price", {
                            required: "Required",
                            pattern: {
                            value: /^\d+(\.\d{1,2})?$/,
                            message: "Only numbers with up to 2 decimal places are allowed",
                            },
                        })}
                        isInvalid={!!errors?.price}
                        />
                    <Form.Control.Feedback type="invalid">
                        {errors?.price?.message}
                    </Form.Control.Feedback>     
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"currency"}>
                    <Form.Label id="currency">{"currency"}</Form.Label>
                        <Form.Select {...register("currency",{required:"Required"})} isInvalid={!!errors?.currency}>
                            <option value={"USD"}>USD</option>
                            <option value={"EURO"}>EURO</option>
                            <option value={"TRY"}>TRY</option>
                        
                        </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors?.currency?.message}
                    </Form.Control.Feedback>     
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"stock"}>
                    <Form.Label id="stock">{"stock"}</Form.Label>
                        <Form.Control
                        
                        {...register("stock", {
                            required: "Required",
                            pattern: {
                            value: /^(?:0|[1-9][0-9]{0,3})$/,
                            message: "Only numbers between [0-9999] are allowed",
                            },
                        })}
                        isInvalid={!!errors?.stock}
                        />
                    <Form.Control.Feedback type="invalid">
                        {errors?.stock?.message}
                    </Form.Control.Feedback>     
                </Form.Group>
                
                <Form.Group className={`${style.formGroup}`} controlId={"deliveryTime"}>
                    <Form.Label id="deliveryTime">{"Delivery time"}</Form.Label>
                        <Form.Select 
                        {...register("deliveryTime", {
                        required: "Required"})}
                        isInvalid={!!errors?.deliveryTime}
                        >
                            <option value={0.16} label="10min"></option>
                            <option value={0.32} label="20min"></option>
                            <option value={0.48} label="30min"></option>
                            <option value={0.64} label="40min"></option>
                            <option value={0.80} label="50min"></option>
                            {Array.from({ length: 72 }, (_, i) => (
                                <option key={i + 1} value={i + 1} label={`${i + 1}h`} />
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors?.deliveryTime?.message}
                        </Form.Control.Feedback>     
                </Form.Group>
                

                {offer
                    ?   <>
                            <Button     
                                className={`${style.submitButton}`}
                                type="submit"
                                form="createLolRPForm"
                                disabled={isSubmitting||editButtonActive}
                                >
                                save change    
                            </Button>
                            {timeDiff 
                            ?   <> 
                                <p className={`${style.timer}`}>{timeDiff}</p>
                                <p className={`${style.timer}`}>2 edit arasında 5 dk beklemelisin</p>
                            </>
                            : <span></span>
                            }
                        </>
                    :   <Button     
                            className={`${style.submitButton}`}
                            type="submit"
                            form="createLolRPForm"
                            disabled={isSubmitting}
                            >
                            create offer    
                        </Button>}

            </Form>
        </Container>
    )
}

export default LolRPForm


