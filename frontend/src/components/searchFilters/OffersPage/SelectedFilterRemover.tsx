import { Control, UseFormGetValues, UseFormReset, UseFormSetValue, useWatch } from "react-hook-form"
import style from "../../../styles/SelectedFilterRemover.module.css"
import { useEffect, useState } from "react"
import { Filter } from "./OffersFilterField"

interface SelectedFilterRemoverProps{
    // selectedFilterData : Record<string,string>[]
    filterData: Record<string, Filter>
    setValue: UseFormSetValue<any>
    getValues: UseFormGetValues<any>
    control: Control<any>
    reset:UseFormReset<any>
}

const SelectedFilterRemover = ({setValue,getValues,control,reset,filterData}:SelectedFilterRemoverProps)=>{

    //range filter ex-> price: {min: '231', max: '4233'} valuenun object olup olmadığını kontrol  ayırt etmek için 
    const isRangeFilter = (value:any) => {  
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            ("min" in value || "max" in value)
        )
    }

    //filter type alma fonksiyonu 
    const getFilterType = (filterName:string) => {
        if(filterName === 'searchInput' || filterName === 'sort' || filterName.includes('.min') || filterName.includes('.max'))  return
        return (filterData[filterName].type)
    }

    //SEÇİLİ FILTERLARI KAPATMA KISMI
    const formValues= useWatch({control})
    const{sort, searchInput, ...restOfFormValues} = formValues // seçilen filterları kapatırken searchInput ve sort gereksiz diye çıkardım
    const [selectedFilters, setSelectedFilters] = useState<Record<string,string>[]>([])
    useEffect(()=>{
        const temporarySelectedFilters:Record<string,string>[] = []
        Object.entries(restOfFormValues).forEach(([filterName,filterValue]:[string,any])=>{
            if(filterValue === '' || filterValue === undefined || filterValue === null || filterValue === false) return
            if (typeof filterValue === "object" && !Array.isArray(filterValue) && Object.keys(filterValue).length === 0) return
            
            if(Array.isArray(filterValue)){
                if(!(filterValue.length>0)) return
                filterValue.forEach((value)=>{
                    temporarySelectedFilters.push({[filterName]:value})
                })
            }
            else if(isRangeFilter(filterValue)){
                Object.entries(filterValue).forEach(([filterName_,filterValue_]:[string,any])=>{
                    if (filterValue_ !== undefined && filterValue_ !== "" && filterValue_ !== null){
                        temporarySelectedFilters.push({[`${filterName}.${filterName_}`]:filterValue_})
                    }
                })
            }
            else if(filterValue === 'true'){
                temporarySelectedFilters.push({[filterName]: (filterValue === 'true').toString()})
            }
            else{
                temporarySelectedFilters.push({[filterName]: filterValue})
            }
        })
        
        setSelectedFilters(temporarySelectedFilters)
    },[formValues])


    

    const removeSelectedFilter = (filterName:string,filterValue:string)=>{
        const arrayValues = getValues(filterName) || [] // array olup olmadığını genel formdan öğrenmek için ve arrayse datayı alıp içinden seçili filtreyi silmek için var
        if(getFilterType(filterName) && getFilterType(filterName) ==='boolean'){
            setValue(`${filterName}`, undefined)
        }
        else if(Array.isArray(arrayValues)){
            if(arrayValues.length>0){
                const filteredArray = arrayValues.filter(value=> value !== filterValue)
                setValue(filterName,filteredArray)
            }
        }
        else if(isRangeFilter(filterValue)){
            setValue(filterName,'')
        }
        else{
            setValue(filterName,'')
        }
        
    }

    const clearAllFilter = ()=>{
        reset()
        // setValue('active', 'true')
    }
    
    const filterRemoverGrid = selectedFilters.map((filterObj:Record<string,string>,i)=>{
        const [[filterName,filterValue]] = Object.entries(filterObj)
        if(getFilterType(filterName)==='boolean'){
            return (
                <div key={i} className={`${style.removerDiv}`}>
                    {filterData[filterName].value[0] === filterValue
                    ? filterData[filterName].label[0] 
                    : filterData[filterName].label[1]}
                    <button className={`${style.removerButton}`} onClick={()=>removeSelectedFilter(filterName,filterValue)}>
                    X
                    </button>
                </div>
            )
        }
        else if(filterName.includes('.min')){
            const newFilterName = filterName.split('.')
            return <div key={i} className={`${style.removerDiv}`}>
                {`Minimum ${newFilterName[0]} : ${filterValue}`}
                    <button className={`${style.removerButton}`} onClick={()=>removeSelectedFilter(filterName,filterValue)}>         
                       X 
                    </button>
                </div>
        }
        else if(filterName.includes('.max')){
            const newFilterName = filterName.split('.')[0]
            const editedFilterName = newFilterName[0].toUpperCase()+ newFilterName.slice(1)
            return <div key={i} className={`${style.removerDiv}`}>
                {`Maximum ${editedFilterName} : ${filterValue}`}
                    <button className={`${style.removerButton}`} onClick={()=>removeSelectedFilter(filterName,filterValue)}>         
                       X 
                    </button>
                </div>
        }
        else{
            return <div key={i} className={`${style.removerDiv}`}>
                {`${filterValue}`}
                    <button className={`${style.removerButton}`} onClick={()=>removeSelectedFilter(filterName,filterValue)}>
                        
                       X
                    </button>
                </div>
        }
    })

    
    return(
        <div className={`${style.allRemoverDiv}`}>
            {filterRemoverGrid}
            <div  className={`${style.removerDiv}`}>
                {`Clear All`}
                    <button className={`${style.removerButton}`} onClick={()=>clearAllFilter()}>
                        
                       X 
                    </button>
            </div>
        </div>
        
        
    )
}

export default SelectedFilterRemover