//resolver error falan onları belki prop olarak gösterip createOfferPage'de değer atamak gerekir.

import { useForm } from "react-hook-form"
import {ValorantBoostCredentials} from "../../../network/serviceForm_api"
import { Button, Container, Form } from "react-bootstrap"
import style from "../../../styles/CreateOfferForm.module.css"
import * as serviceForm_api from "../../../network/serviceForm_api"
import { useNavigate } from "react-router-dom"
import { ValorantBoost as ValorantBoostOfferModel} from "../../../models/offers/ValorantOfferModels"
import { useEffect, useRef, useState } from "react"

interface ValorantBoostFormProps{
    offer?: ValorantBoostOfferModel
}

const ValorantBoostForm= ({offer}:ValorantBoostFormProps)=>{

    const {register, handleSubmit, formState : {errors, isSubmitting}}  = useForm<ValorantBoostCredentials>({mode: "all",
        defaultValues:{
            title: offer?.title || "",
            description: offer?.description || "",
            server: offer?.server || "",
            desiredRank: offer?.desiredRank || "",
            price: offer?.price ?? undefined,
            currency: offer?.currency || "",
            duration: offer?.duration ?? undefined,
            deliveryTime: offer?.deliveryTime ?? undefined,
            stock: offer?.stock ?? undefined,
            serviceType: offer?.serviceType || "",
        }})

    const navigate = useNavigate()

    const [serviceType, setServiceType]= useState(offer?.serviceType || "")
    const [desiredRank, setDesiredRank]= useState(offer?.desiredRank || "")

    const onSubmit = async(credentials:ValorantBoostCredentials) => {
        const newCredentials = {...credentials,"serviceType":serviceType,"desiredRank":desiredRank} //serviceType register dışında sonradan eklendiği için ekstra newCredentials kullandım
        
        if(offer){
            const currentTime = new Date()
            const offerTime = new Date(offer.updatedAt)
            if(Math.trunc((currentTime.getTime()-offerTime.getTime())/1000)>editDelayTime){
                const editIdData = {sellerId:offer.sellerId, _id: offer._id}
                await serviceForm_api.editValorantBoostOffer(newCredentials,editIdData)
                navigate("/manageOffer")
            }else{
                alert("2 edit arasında 5 dk bekle")
            }
        }
        else{
            await serviceForm_api.createValorantBoostOffer(newCredentials)
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
            <p className={`${style.formTitle}`}>Valorant Boost Form</p>
            <Form onSubmit={handleSubmit(onSubmit)}
            id="createValorantBoostForm"
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


                <Form.Group className={`${style.formGroup}`} controlId={"desiredRank"}>
                    <Form.Label id="desiredRank">{"desiredRank"}</Form.Label>
                    <Form.Select 
                        {...register("desiredRank",{required:"Required"})} 
                        isInvalid={!!errors?.desiredRank}
                        onChange={(e)=> {
                            const [service,rank] = e.target.value.split("_") // split kullanıp dataları çektim
                            setServiceType(service)
                            setDesiredRank(rank)}
                            }>
                            <optgroup label="SoloBoost">
                                <option value="SoloBoost_Iron">Iron</option>
                                <option value="SoloBoost_Bronze">Bronze</option>               
                                <option value="SoloBoost_Silver">Silver</option>
                                <option value="SoloBoost_Gold">Gold</option>
                                <option value="SoloBoost_Platinum">Platinum</option>
                                <option value="SoloBoost_Emerald">Emerald</option>
                                <option value="SoloBoost_Diamond">Diamond</option>
                                <option value="SoloBoost_Master">Master</option>
                                <option value="SoloBoost_Grandmaster">Grandmaster</option>
                                <option value="SoloBoost_Challenger">Challenger</option>
                            </optgroup>

                            <optgroup label="DuoBoost">
                                <option value="DuoBoost_Iron">Iron</option>
                                <option value="DuoBoost_Bronze">Bronze</option>               
                                <option value="DuoBoost_Silver">Silver</option>
                                <option value="DuoBoost_Gold">Gold</option>
                                <option value="DuoBoost_Platinum">Platinum</option>
                                <option value="DuoBoost_Emerald">Emerald</option>
                                <option value="DuoBoost_Diamond">Diamond</option>
                                <option value="DuoBoost_Master">Master</option>
                                <option value="DuoBoost_Grandmaster">Grandmaster</option>
                                <option value="DuoBoost_Challenger">Challenger</option>
                            </optgroup>

                            <optgroup label="Per Win">
                                <option value="PerWin_Iron">Iron</option>
                                <option value="PerWin_Bronze">Bronze</option>               
                                <option value="PerWin_Silver">Silver</option>
                                <option value="PerWin_Gold">Gold</option>
                                <option value="PerWin_Platinum">Platinum</option>
                                <option value="PerWin_Emerald">Emerald</option>
                                <option value="PerWin_Diamond">Diamond</option>
                                <option value="PerWin_Master">Master</option>
                                <option value="PerWin_Grandmaster">Grandmaster</option>
                                <option value="PerWin_Challenger">Challenger</option>
                            </optgroup>

                            <optgroup label="Placement match">
                                <option value="Placement_Unranked">Unranked</option>
                                <option value="Placement_Iron">Iron</option>
                                <option value="Placement_Bronze">Bronze</option>               
                                <option value="Placement_Silver">Silver</option>
                                <option value="Placement_Gold">Gold</option>
                                <option value="Placement_Platinum">Platinum</option>
                                <option value="Placement_Emerald">Emerald</option>
                                <option value="Placement_Diamond">Diamond</option>
                                <option value="Placement_Master">Master</option>
                                <option value="Placement_Grandmaster">Grandmaster</option>
                                <option value="Placement_Challenger">Challenger</option>
                            </optgroup>
                            
                        </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors?.desiredRank?.message}
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

                <Form.Group className={`${style.formGroup}`} controlId={"duration"}>
                    <Form.Label id="duration">{"duration"}</Form.Label>
                        <Form.Select 
                        {...register("duration", {
                        required: "Required"})}
                        isInvalid={!!errors?.duration}
                        >
                            <option value={7} label="7days"></option>
                            <option value={14} label="14days"></option>
                            <option value={30} label="30days"></option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors?.duration?.message}
                        </Form.Control.Feedback>     
                </Form.Group>         
                
                {offer
                    ?   <>
                            <Button     
                                className={`${style.submitButton}`}
                                type="submit"
                                form="createValorantBoostForm"
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
                            form="createValorantBoostForm"
                            disabled={isSubmitting}
                            >
                            create offer    
                        </Button>}

            </Form>
        </Container>
    )
}

export default ValorantBoostForm


