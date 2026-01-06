import { Button, Form } from "react-bootstrap"
import style from "../../../styles/OffersFilterField.module.css"
import { useForm, UseFormReturn, useWatch  } from "react-hook-form"
import OffersFilterModal from "./OffersFilterModal"
import { SetStateAction, useEffect, useState } from "react"
import OffersSortModal from "./OffersSortModal"
import searchSorts from "../../../utils/searchSorts"
import SelectedFilterRemover from "./SelectedFilterRemover"
import Pagination from "../../Pagination"

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

    const  {register, handleSubmit, getValues, watch,control, setValue, reset, formState : {errors, isSubmitting}} = useForm<any>({mode: "all",
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
    
    const onSubmit = (credentials:any) => {
        console.log('ege')
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
            // console.log('stringifiedSort:', stringifiedSort)

            setValue(`sort`,stringifiedSort)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[stringifiedSort])

    // //SEÇİLİ FILTERLARI KAPATMA KISMI  --> bunu direkt SelectedFilterRemover içine  attım, datayı orda kendi içinde halletsin
    // const formValues= useWatch({control})
    // const{sort, searchInput, ...restOfFormValues} = formValues // seçilen filterları kapatırken searchInput ve sort gereksiz diye çıkardım
    // const [selectedFilters, setSelectedFilters] = useState<Record<string,string>[]>([])
    // useEffect(()=>{
    //     const temporarySelectedFilters:Record<string,string>[] = []
    //     Object.entries(restOfFormValues).forEach(([filterName,filterValue]:[string,any])=>{
    //         if(filterValue === '' || filterValue === undefined || filterValue === null || filterValue === false) return
            
    //         if(Array.isArray(filterValue)){
    //             if(!(filterValue.length>0)) return
    //             filterValue.forEach((value)=>{
    //                 temporarySelectedFilters.push({[filterName]:value})
    //             })
    //         }
    //         else if(filterValue === 'true'){
    //             temporarySelectedFilters.push({[filterName]: (filterValue === 'true').toString()})
    //         }
    //         else{
    //             temporarySelectedFilters.push({[filterName]: filterValue})
    //         }
    //     })
    //     setSelectedFilters(temporarySelectedFilters)
    //     console.log(temporarySelectedFilters)
    // },[formValues])



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
                <SelectedFilterRemover
                    // selectedFilterData={selectedFilters}
                    setValue={setValue}
                    getValues={getValues}
                    control={control}
                    reset={reset}
                />
                
            </div>
            <OffersSortModal
            register={register}
            sortData={searchSorts.OffersPage}
            />
        </div>
        
    )
}

export default OffersFilterField