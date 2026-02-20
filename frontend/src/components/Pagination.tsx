import { SetStateAction, useEffect } from "react"
import { Button } from "react-bootstrap"
import style from '../styles/Pagination.module.css'
import { useDispatch } from "react-redux"
import { AppDispatch } from "../store/store"
import { editPage, PageSliceAction } from "../store/features/page/pageSlice"

// offers gibi redux kullanılan sayfalarda pagination sayfayı reduxa kaydediyor.

interface PaginationProps{
    currentPage: number
    lastPage: number
    setCurrentPage: React.Dispatch<SetStateAction<number>>
    usingRedux: boolean
    serviceCategoryName?: string
}

const Pagination = ({currentPage,lastPage,setCurrentPage,usingRedux,serviceCategoryName}:PaginationProps)=>{
    const range = 2     
    const dispatch = useDispatch<AppDispatch>()

    function setPagesArray(currentPage:number,lastPage:number,range:number){
        const pages:Set<Number>= new Set()

        if(lastPage<=((2*range)+3)){
            return Array.from({length:lastPage},(_,i) => i+1)
        }

        let start = currentPage - range
        let end = currentPage + range

        if(start <= 1){
            start = 2
            end = (2*range)+2
        }
        else if(end>= lastPage){
            start = lastPage - (2*range+1)
            end = lastPage - 1
        }
        
        pages.add(1)
        for(let i = start; i<=end; i++){
            pages.add(i)
        }
        pages.add(lastPage)

        // console.log('pages:', Array.from(pages))
        
        return pages

    }

    useEffect(()=>{
        // console.log(setPagesArray(currentPage,lastPage,range))
    },[])

    const paginationButtonsGrid = Array.from(setPagesArray(currentPage,lastPage,range)).map((pageNumber,i)=>{
        return(
            <Button key={i} className={`${style.pageButton}`}
            disabled={currentPage===pageNumber}
            onClick={()=>{
                setCurrentPage(()=>{
                    if(usingRedux && serviceCategoryName){
                        const pageNameAndData:PageSliceAction = { pageName: serviceCategoryName,pageData: Number(pageNumber)}
                        dispatch(editPage(pageNameAndData))
                    }
                    
                    return Number(pageNumber)
                })
            }}
            >
                {Number(pageNumber)}
            </Button>
        )
    })

    

    return(
        <div className={`${style.pageButtonDiv}`}>
            <Button className={`${style.pageButton} ${style.pageButtonEdge}`}
            disabled={currentPage===1}
            onClick={() => setCurrentPage((prev)=>{
                    if(usingRedux && serviceCategoryName){
                        const pageNameAndData:PageSliceAction = { pageName: serviceCategoryName,pageData: Number(prev - 1)}
                        dispatch(editPage(pageNameAndData))
                    }
                    
                    return prev - 1
                })}
            >
            {"<"}
            </Button>

            {paginationButtonsGrid}

            <Button className={`${style.pageButton} ${style.pageButtonEdge}`}
            disabled={currentPage===lastPage}
            onClick={() => setCurrentPage((prev)=>{
                    if(usingRedux && serviceCategoryName){
                        const pageNameAndData:PageSliceAction = { pageName: serviceCategoryName,pageData: Number(prev + 1)}
                        dispatch(editPage(pageNameAndData))
                    }
                    
                    return prev + 1
                })}
            >
            {">"}
            </Button>
        </div>
        
    )
}

export default Pagination