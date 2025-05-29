import { useEffect, useState } from "react"
import { Container, Form } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import * as OfferApi from "../../network/offers_api"
import Select from 'react-select'
import style from "../../styles/CreateOfferPage.module.css"
import LolAccountForm from "../serviceForms/Lol/LolAccountForm"
import LolBoostForm from "../serviceForms/Lol/LolBoostForm"
import LolCoachForm from "../serviceForms/Lol/LolCoachForm"
import LolRPForm from "../serviceForms/Lol/LolRPForm"
import ValorantAccountForm from "../serviceForms/Valorant/ValorantAccountForm"
import ValorantBoostForm from "../serviceForms/Valorant/ValorantBoostForm"
import ValorantCoachForm from "../serviceForms/Valorant/ValorantCoachForm"
import ValorantVPForm from "../serviceForms/Valorant/ValorantVPForm"

const CreateOfferPage = () => {


    const [categoryNames, setcategoryNames] = useState<any>([])
    const [serviceDisabled, setserviceDisabled] = useState<boolean>(true)
    const [serviceNames, setserviceNames] = useState<any>([])
    const [formName, setFormName] = useState<string>()

   

    const options = [
        { value: "lol", label: "League of Legends" },
        { value: "dota", label: "Dota 2" },
        { value: "csgo", label: "CS:GO" },
      ];


    const {register,
           handleSubmit,
           watch,
           control,
           formState: { errors, isSubmitting }  } = useForm()

    const [selectedCategory, selectedService] = watch(["category","service"])     

    async function fetchCategories() {

        try {
            const fetchedCategories = await OfferApi.fetchCategories()
            //alt kısım Select options ayarlamak için value ve label datalı objelerle array oluşturduk
            const selectCategories = fetchedCategories.map((value) => ({value:value.name, label: value.name}))
            setcategoryNames(selectCategories)
        } catch (error) {
            console.error(error)
            alert("createOffer category fetch patladı")
        }
    }

    async function fetchServices(categoryName:string) {
        try {
            const fetchedServices = await OfferApi.fetchServices(categoryName)
             //alt kısım Select options ayarlamak için value ve label datalı objelerle array oluşturduk
            const selectServices = fetchedServices.map(value =>({value:value.serviceName, label: value.serviceName}))
            setserviceNames(selectServices)
        } catch (error) {
            console.error(error)
            alert("service fetch patladı")
        }
    }

    // async function onChangeFormName(e:any) {
        
    
    //         const categoryServiceName = await selectedCategory.value.toString().concat(e.value.toString())
    //         setFormName(categoryServiceName)
    // }

            async function concatFormName() {
        
                const categoryServiceName = await selectedCategory.value.toString().concat(selectedService.value.toString())
                setFormName(categoryServiceName)
            }

           useEffect(()=>{
               document.body.style.backgroundColor= "#FAFAFA"
               fetchCategories()
           },[])

           useEffect(()=>{
            
                if(selectedCategory){
                    //console.log(selectedCategory.value)
                    setserviceDisabled(false)
                    //service fetch
                    fetchServices(selectedCategory.value)
                }
           },[selectedCategory])
            
           useEffect(()=>{
            if(selectedService){
                concatFormName()
            }   
           // eslint-disable-next-line react-hooks/exhaustive-deps
           },[selectedService,selectedCategory])

           

    return(
        <>
            <Container>
            <br/>
            

            <Container className= {`${style.categoryContainer}`} >
                <Form>
                    <Form.Group>
                    <Form.Label></Form.Label>
                    <span>Category:</span>
                    
                    <Controller
                        name="category"
                        control={control}
                        //defaultValue={null}
                        render={({ field }) => (
                        <Select
                            {...field}
                            options={categoryNames}
                            isDisabled={false}
                            isSearchable={true}
                            isLoading={false}
                            placeholder="Choose category"
                        />
                        )}
                    />
                    
                    </Form.Group>
                

                <br/>

                
                    <Form.Group>
                    <Form.Label></Form.Label>
                    <span>Service:</span>
                    <Controller
                        name="service"
                        control={control}
                        //defaultValue={null}
                        render={({ field }) => (
                        <Select
                            {...field}
                            // onChange={(e)=>concatFormName(e)}
                            options={serviceNames}
                            isDisabled={false}
                            isSearchable={true}
                            isLoading={false}
                            placeholder="Choose service"
                        />
                        )}
                    />
                        
                    </Form.Group>
                </Form>

            </Container>

            <Container className={`${style.formContainer}`}>

                {formName==="LolAccount" &&
                    <LolAccountForm/>
                }

                {formName==="LolBoost" &&
                    <LolBoostForm/>
                }

                {formName==="LolCoach" &&
                    <LolCoachForm/>
                }

                {formName==="LolRP" &&
                    <LolRPForm/>
                }

                {formName==="ValorantAccount" &&
                    <ValorantAccountForm/>
                }

                {formName==="ValorantBoost" &&
                    <ValorantBoostForm/>
                }

                {formName==="ValorantCoach" &&
                    <ValorantCoachForm/>
                }

                {formName==="ValorantVP" &&
                    <ValorantVPForm/>
                }
            </Container>
            </Container>
        </>
    )
}

export default CreateOfferPage