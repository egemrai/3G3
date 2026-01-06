import { Control, UseFormGetValues, UseFormReset, UseFormSetValue, useWatch } from "react-hook-form"
import style from "../../../styles/SelectedFilterRemover.module.css"
import { useEffect, useState } from "react"

interface SelectedFilterRemoverProps{
    // selectedFilterData : Record<string,string>[]
    setValue: UseFormSetValue<any>
    getValues: UseFormGetValues<any>
    control: Control<any>
    reset:UseFormReset<any>
}

const SelectedFilterRemover = ({setValue,getValues,control,reset}:SelectedFilterRemoverProps)=>{

    //SEÇİLİ FILTERLARI KAPATMA KISMI
    const formValues= useWatch({control})
    const{sort, searchInput, ...restOfFormValues} = formValues // seçilen filterları kapatırken searchInput ve sort gereksiz diye çıkardım
    const [selectedFilters, setSelectedFilters] = useState<Record<string,string>[]>([])
    useEffect(()=>{
        const temporarySelectedFilters:Record<string,string>[] = []
        Object.entries(restOfFormValues).forEach(([filterName,filterValue]:[string,any])=>{
            if(filterValue === '' || filterValue === undefined || filterValue === null || filterValue === false) return
            
            if(Array.isArray(filterValue)){
                if(!(filterValue.length>0)) return
                filterValue.forEach((value)=>{
                    temporarySelectedFilters.push({[filterName]:value})
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
        if(filterValue === 'true'){
            setValue(`${filterName}`,false)
        }
        
        else if(Array.isArray(arrayValues)){
            if(arrayValues.length>0){
                const filteredArray = arrayValues.filter(value=> value !== filterValue)
                setValue(filterName,filteredArray)
            }
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
        if(filterValue === 'true'){
            return (
                <div key={i} className={`${style.removerDiv}`}>
                    {` ${filterName}`}
                    <button className={`${style.removerButton}`} onClick={()=>removeSelectedFilter(filterName,filterValue)}>
                    X
                        
                    </button>
                </div>
            )
        }
        else if(filterName.startsWith('min') || filterName.startsWith('max')){
            return <div key={i} className={`${style.removerDiv}`}>
                {`${filterName} : ${filterValue}`}
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