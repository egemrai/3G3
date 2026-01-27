//resolver error falan onları belki prop olarak gösterip createOfferPage'de değer atamak gerekir.

import { useForm } from "react-hook-form"
// import {LolAccountCredentials} from "../../../network/serviceForm_api"
import { Button, Container, Form } from "react-bootstrap"
import style from "../../../styles/CreateOfferForm.module.css"
import * as serviceForm_api from "../../../network/serviceForm_api"
import { useNavigate } from "react-router-dom"
import { LolAccount as LolAccountOfferModel } from "../../../models/offers/LolOfferModels"
import { useEffect, useRef, useState } from "react"

interface LolAccountFormProps{
    offer?: LolAccountOfferModel
}

const LolAccountForm= ({offer}:LolAccountFormProps)=>{

    // const [serviceType]

    const {register, handleSubmit, formState : {errors, isSubmitting}}  = useForm<Record<any,string>>({mode: "all"})
        
        //  Neden ?? (nullish coalescing) kullandık?
        //  || operatörü 0 değerini de false kabul eder ve undefined döndürür. Eğer 0 geçerli bir değer ise ?? kullanmalısın.

    const navigate = useNavigate()

    const onSubmit = async(credentials:Record<any,string>) => {
        if(offer){
            const currentTime = new Date()
            const offerTime = new Date(offer.updatedAt)
            if(Math.trunc((currentTime.getTime()-offerTime.getTime())/1000)>editDelayTime){
                const editIdData = {sellerId:offer.sellerId, _id: offer._id}
                // await serviceForm_api.editLolAccountOffer(credentials,editIdData)
                navigate("/manageOffer")
            }else{
                alert("2 edit arasında 5 dk bekle")
            }
        }
        else{
            // await serviceForm_api.createLolAccountOffer(credentials)
            navigate("/manageOffer")
        }
    }

    let [timeDiff, setTimeDiff] = useState<number>()
    const [editButtonActive, setEditButtonActive] = useState<boolean>()
    const editDelayTime = 300

    

    

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
    },[offer])

    const intervalRef = useRef<any>(null)

    useEffect(()=>{
        if(timeDiff && timeDiff>0){
            intervalRef.current = setInterval(()=>{      //Her saniye timeDiff'i set ediyoruz, 0 olana kadar
                setTimeDiff((prev)=>{       
                    if(prev && prev <=1){
                        clearInterval(intervalRef.current)
                        setEditButtonActive(false)
                        return 0
                    }else{
                        return (prev ?? 1) -1
                    }
                })
            },1000)
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    },[timeDiff])

    // const intervalRef = useRef<any> (null) // NodeJS.Timeout
    // useEffect(()=>{
    //      intervalRef.current  = setInterval(reduceTimer,1000)
    // },[offer])
    
    // useEffect(()=>{
    //     if((timeDiff===0 || timeDiff as number <0) && intervalRef.current){
    //         clearInterval(intervalRef.current )
    //         setEditButtonActive(false)
    //     }
    // },[timeDiff])

    return (

        <Container className={`${style.container}`}>
            <p className={`${style.formTitle}`}>Lol Account Form</p>
            <Form onSubmit={handleSubmit(onSubmit)}
            id="createLolAccountForm"
            >
                <Form.Group className={`${style.formGroup}`} controlId={"title"}>
                    <Form.Label id="title">{"title:"}</Form.Label>
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

                <Form.Group className={`${style.formGroup}`} controlId={"rank"}>
                    <Form.Label id="rank">{"rank"}</Form.Label>
                        <Form.Select {...register("rank",{required:"Required"})} isInvalid={!!errors?.rank}>
                        
                            <option value="Iron 4">Iron 4</option>
                            <option value="Iron 3">Iron 3</option>
                            <option value="Iron 2">Iron 2</option>
                            <option value="Iron 1">Iron 1</option>

                            <option value="Bronze 4">Bronze 4</option>
                            <option value="Bronze 3">Bronze 3</option>
                            <option value="Bronze 2">Bronze 2</option>
                            <option value="Bronze 1">Bronze 1</option>

                            <option value="Silver 4">Silver 4</option>
                            <option value="Silver 3">Silver 3</option>
                            <option value="Silver 2">Silver 2</option>
                            <option value="Silver 1">Silver 1</option>

                            <option value="Gold 4">Gold 4</option>
                            <option value="Gold 3">Gold 3</option>
                            <option value="Gold 2">Gold 2</option>
                            <option value="Gold 1">Gold 1</option>

                            <option value="Platinum 4">Platinum 4</option>
                            <option value="Platinum 3">Platinum 3</option>
                            <option value="Platinum 2">Platinum 2</option>
                            <option value="Platinum 1">Platinum 1</option>

                            <option value="Emerald 4">Emerald 4</option>
                            <option value="Emerald 3">Emerald 3</option>
                            <option value="Emerald 2">Emerald 2</option>
                            <option value="Emerald 1">Emerald 1</option>

                            <option value="Diamond 4">Diamond 4</option>
                            <option value="Diamond 3">Diamond 3</option>
                            <option value="Diamond 2">Diamond 2</option>
                            <option value="Diamond 1">Diamond 1</option>

                            <option value="Master 1">Master 1</option>
                            <option value="Grandmaster">Grandmaster</option>
                            <option value="Challenger">Challenger</option>
                        </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors?.rank?.message}
                    </Form.Control.Feedback>     
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"champions"}>
                    <Form.Label id="champions">{"champions"}</Form.Label>
                        <Form.Control
                        {...register("champions", {
                            required: "Required",
                            pattern: {
                            value: /^\d+$/,
                            message: "Only numbers are allowed",
                            },
                        })}
                        isInvalid={!!errors?.champions}
                        />
                    <Form.Control.Feedback type="invalid">
                        {errors?.champions?.message}
                    </Form.Control.Feedback>     
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"skins"}>
                    <Form.Label id="skins">{"skins"}</Form.Label>
                        <Form.Control
                        {...register("skins", {
                            required: "Required",
                            pattern: {
                            value: /^\d+$/,
                            message: "Only numbers allowed",
                            },
                        })}
                        isInvalid={!!errors?.skins}
                        />
                    <Form.Control.Feedback type="invalid">
                        {errors?.skins?.message}
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
                                form="createLolAccountForm"
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
                            form="createLolAccountForm"
                            disabled={isSubmitting}
                            >
                            create offer    
                        </Button>}

            </Form>
        </Container>
    )
}

export default LolAccountForm


