
import { useForm } from "react-hook-form"
import { Button, Container, Form } from "react-bootstrap"
import style from "../../styles/CreateOfferForm.module.css"
import * as serviceForm_api from "../../network/serviceForm_api"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import offerFormData from "../../utils/offerFormData"
import FormInput from "./FormInput"

interface OfferFormProps
{
    offer?: any
    serviceName: string
    categoryName: string
}

const OfferForm= ({offer,categoryName,serviceName}:OfferFormProps)=>{

    const [defaultFormValues, setDefaultFormValues] = useState<Record<string,any>>()
    const [formName, setFormName] = useState<string>()
    const [formInputGrid, setFormInputGrid] = useState<any>()
    const navigate = useNavigate()


    const setDefaultFormValuesOnMount = () =>{
        try {
            if(!formName) return

            const values: Record<string, any> = {}

            Object.keys(offerFormData[formName]).forEach((name:string) => {
                // select-group form inputu editleyebilmek için alt satırdaki if
                if(name.includes('_')){//foreach içinde desiredRank_serviceType geldiğinde, offer.desiredRank ve offer.serviceType datasını alt satırda birleştiriyorum
                    if(!offer?.[name.split('_')[0]] && !offer?.[name.split('_')[1]]) return
                    values[name] = offer?.[name.split('_')[0]]+'_'+offer?.[name.split('_')[1]] 
                }
                else{
                    values[name] = offer?.[name] ?? undefined
                }
            })
            setDefaultFormValues(values)
        } catch (error) {
            console.error(error)
        }
        
    }
    //  Neden ?? (nullish coalescing) kullandık?
    //  || operatörü 0 değerini de false kabul eder ve undefined döndürür. Eğer 0 geçerli bir değer ise ?? kullanmalısın.

    const {register, handleSubmit, reset, setValue, formState}  = useForm<any>({mode: "all",shouldUnregister: false})

    useEffect(()=>{
        setFormName(categoryName.concat(serviceName))
    },[])

    useEffect(()=>{
        setFormName(categoryName.concat(serviceName))
    },[categoryName,serviceName])

    useEffect(()=>{
        try {
            if(formName){
            setFormInputGrid(Object.entries(offerFormData[formName]).map(([name,data]:[string,any])=>{
            return(
                <FormInput key={name}
                register={register}
                formState={formState}
                inputName={name}
                inputData={data}/>
            )
        }))
        }
        } catch (error) {
            console.error(error)
        }
        
    
    },[formName]) 

    useEffect(()=>{
        if(formInputGrid){
            setDefaultFormValuesOnMount()
        }
        
    },[formInputGrid]) 

    useEffect(()=>{
        if( defaultFormValues && Object.keys(defaultFormValues).length>0){
            Object.entries(defaultFormValues).forEach(([key,value]:[string,any])=>{
            setValue(key,value)
        })
        }
        
    },[defaultFormValues])    
        

    const onSubmit = async(credentials:any) => {
        if(!credentials && !categoryName && !serviceName) return
        credentials.categoryName = categoryName
        credentials.serviceName = serviceName
        Object.entries(credentials).forEach(([key,value]:[string,any]) => {  // key --> desiredRank_serviceType  value --> Bronze_PlacementMatch
            if(key.includes('_')){                                           // credentials içindeki desiredRank_serviceType'ı alıp, 2 farklı key yapıyorum, daha sonra desiredRank_serviceType'ı siliyorum
                credentials[key.split('_')[0]] = value.split('_')[0]
                credentials[key.split('_')[1]] = value.split('_')[1]
                delete credentials[key]
            }
        })
        if(offer){
            const editIdData = {sellerId:offer.sellerId, _id: offer._id}
            await serviceForm_api.editOffer(credentials,editIdData)
            navigate("/manageOffer")
        }
        else{
            await serviceForm_api.createOffer(credentials)
            navigate("/manageOffer")
        }
    }

    
    return (

        <Container className={`${style.container}`}>
            <p className={`${style.formTitle}`}>{`${formName} Form`}</p>
            <Form onSubmit={handleSubmit(onSubmit)}
            id="createEditOfferForm"
            >
                
            {formName && 
                formInputGrid
            }

            {offer
                ?   <>
                        <Button     
                            className={`${style.submitButton}`}
                            type="submit"
                            form="createEditOfferForm"
                            disabled={formState.isSubmitting}
                            >
                            save change    
                        </Button>
                        
                    </>
                :   <Button     
                        className={`${style.submitButton}`}
                        type="submit"
                        form="createEditOfferForm"
                        disabled={formState.isSubmitting}
                        >
                        create offer    
                    </Button>}

            </Form>
        </Container>
    )
}

export default OfferForm


