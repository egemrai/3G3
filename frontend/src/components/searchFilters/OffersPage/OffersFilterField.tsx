import { Button, Form } from "react-bootstrap"
import style from "../../../styles/OffersFilterField.module.css"
import { useForm, UseFormReturn } from "react-hook-form"
import OffersFilterModal from "./OffersFilterModal"
import { useEffect } from "react"
import OffersSortModal from "./OffersSortModal"
import searchSorts from "../../../utils/searchSorts"

export interface Filter{
    type: string
    value: (string|number)[] 
}

interface OffersFilterFieldProps{
    filterData: Record<string, Filter>
    searchWithFilter: (credentials:any)=>void   
    stringifiedFilter:string
    stringifiedSort:string
}
//Bütün search divi bu. Filter, sort ,seçilen filterı kapatma, clearAll falan bunun içinde
const OffersFilterField =  ( {filterData, searchWithFilter,stringifiedFilter,stringifiedSort}: OffersFilterFieldProps) => {

    const  {register, handleSubmit, getValues, watch, setValue, reset, formState : {errors, isSubmitting}} = useForm<any>({mode: "all",
        defaultValues:{
            sort: 'Lowest price'
        }
    })

    // const {register, handleSubmit, getValues,setValue, formState : {errors, isSubmitting}}  = formMethods

    const filterModalsGrid = Object.entries(filterData).map(([name,filter]:[string,Filter])=>{
        
        return(
        <OffersFilterModal
        key={name}
        filterData={filter}
        filterName={name}
        register={register}
        />
        )
    })

    const formValues= watch()
    
    const onSubmit = (credentials:any) => {
        searchWithFilter(credentials)
    }

    useEffect(()=>{
        if(stringifiedFilter){
            const parsedFilter = JSON.parse(stringifiedFilter)

            Object.entries(parsedFilter).forEach(([key,value])=>{
                setValue(`${key}`,value)
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[stringifiedFilter])

    useEffect(()=>{ //stringifiedSort direkt 1 kelime string olabilir, parse istemeyebilir sonradan ayarla
        if(stringifiedSort){
            
            console.log('stringifiedSort:', stringifiedSort)
            console.log('stringifiedSort:', stringifiedSort)


            setValue(`sort`,stringifiedSort)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[stringifiedSort])

    useEffect(()=>{
        console.log('formvalues:',formValues)
        console.log('formvalues:',formValues)
        console.log('formvalues:',formValues)
    },[formValues])



    return  (
        <div className= {`${style.mainDiv}`}>
            <div className= {`${style.filterDiv}`}>
                <Form onSubmit={handleSubmit(onSubmit)} 
                id="offersSearchFilter"
                className={`${style.displayFlex} ${style.height_100}`}
                >

                    <button    
                        className={`${style.searchButton}`}
                        type="submit"
                        form="offersSearchFilter"
                        disabled={isSubmitting||false}
                        >
                            
                    </button>

                    <Form.Control  className={`${style.searchInput}`}
                    {...register("searchInput",{
                        required:false
                        })
                    }
                    placeholder="Search..."
                    />
                    
                    <div className={`${style.searchFiltersDiv}`}>
                        {filterModalsGrid}
                    </div>
            
            </Form>
            </div>
            
            <div className= {`${style.clearFilterDiv}`}>
                
            </div>
            <OffersSortModal
            register={register}
            sortData={searchSorts.OffersPage}
            />
        </div>
        
    )
}

export default OffersFilterField