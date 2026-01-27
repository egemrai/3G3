import { useEffect, useState } from "react"
import { Container, Form } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import * as OfferApi from "../../network/offers_api"
import Select from 'react-select'
import style from "../../styles/CreateOfferPage.module.css"
import OfferForm from "../serviceForms/OfferForm"

const CreateOfferPage = () => {


    const [categoryNames, setcategoryNames] = useState<any>([])
    const [serviceNames, setserviceNames] = useState<any>([])
    
    const [category, setCategory] = useState<string>('')
    const [service, setService] = useState<string>('')

    const [offerFormDelay, setOfferFormDelay] = useState<boolean>(false)


    const {
           watch,
           control } = useForm()

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


        useEffect(()=>{
            document.body.style.backgroundColor= "#FAFAFA"
            fetchCategories()
        },[])

        useEffect(()=>{
        
            if(selectedCategory){
                // console.log(selectedCategory) // --> {value: 'Lol', label: 'Lol'}
                setCategory(selectedCategory.value)
                //service fetch
                fetchServices(selectedCategory.value)
            }
        },[selectedCategory])
        
        useEffect(()=>{
        if(selectedService){
            setService(selectedService.value)
            setOfferFormDelay(true) //bunu ekledim; offerForm erken render oluyordu , artık olmuyor
            
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

                {selectedCategory && selectedService && offerFormDelay &&
                    <OfferForm
                    categoryName={category}
                    serviceName={service}
                />}

                {/* {formName==="LolAccount" &&
                    <LolAccountForm/>
                } */}

            </Container>
            </Container>
        </>
    )
}

export default CreateOfferPage