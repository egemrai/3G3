import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import * as offers_api from "../../network/offers_api"
import * as elasticSearch_api from "../../network/elasticSearch_api"
import { Button, Col, Container, Row } from "react-bootstrap"
import OfferSmall from "../OfferSmall"
import style from "../../styles/OffersPage.module.css"
import searchFilters from "../../utils/searchFilters"
import OffersFilterField from "../searchFilters/OffersPage/OffersFilterField"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { editFilter, FilterSliceAction } from "../../store/features/filter/filterSlice"
import { editSort, SortSliceAction } from "../../store/features/sort/sortSlice"
import Pagination from "../Pagination"

export interface getOffersReturnType{
            offers:any[]
            totalOfferCount:number
            limit:number
        }

// eski ismi OffersContainer'dı

const OffersPage= () => {
    const URLParams= useParams<{category: string, service: string}>()
    const location = useLocation()
    const navigate = useNavigate()

    //URL search parametrelerindeki datayı almak için kullandım
    const searchParams = new URLSearchParams(location.search)
    const usernameURL = searchParams.get("username")
    const pageURL = searchParams.get("page")
    const filterURL = searchParams.get("filter")
    const sortURL = searchParams.get("sort")
    console.log(Object.fromEntries(searchParams.entries()))

    let serviceCategoryName =''
    if(URLParams.category && URLParams.service)
     serviceCategoryName = URLParams.category!.concat(URLParams.service!)

    //PAGINATION AYARLAMA KISMI
    const [currentPage, setCurrentPage] = useState<number>(Number(pageURL) ?? 1)
    const [lastPage, setlastpage] = useState<number>(7)

    //FILTER İLE SEARCH YAPMA KISMI
    const allReduxStore = useSelector((state:any)=> state)
    const filterRedux = useSelector((state: RootState) => state.filter.filter) // state.filter slice'ın adı, filter: {LolAccount:{...}, LolBoost:{...},...} döndürüyor, o yüzden tekrar filter yazdım --> direkt filter objectinin içini almak için
    const sortRedux = useSelector((state: RootState) => state.sort.sort) 
    const dispatch = useDispatch<AppDispatch>()
    const [filter, setFilter] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    function setFilterAndSortOnMount(){
        if(filterURL ){ //önce URLden encoded filter aldım
            const filterNameAndData:FilterSliceAction = { filterName: serviceCategoryName, filterData: filterURL} // console.log(filterURL) = {"searchInput":"ege","Server":["EUW","NA"]}
            dispatch(editFilter(filterNameAndData))
            setFilter(filterURL) 
        
        }
        else if(filterRedux[serviceCategoryName]){ //sonra URLde yoksa reduxtan filter aldım
            const stringifiedFilter = filterRedux[serviceCategoryName] //console.log(filterRedux[serviceCategoryName]) = {"searchInput":"ege","Server":["EUW","NA"]}
            searchParams.set('filter',stringifiedFilter)
            setFilter(stringifiedFilter)
        }
        if(sortURL ){ //önce URLden encoded sort aldım
            const sortNameAndData:SortSliceAction = { sortName: 'OffersPage', sortData: sortURL}
            dispatch(editSort(sortNameAndData))
            setSort(sortURL)
        }
        else if(sortRedux['OffersPage']){ //sonra URLde yoksa reduxtan sort aldım
            const sort = sortRedux['OffersPage'] // düz string zaten, stringify gerek yok
            searchParams.set('sort', sort)
            setSort(sort)
        }

        //filter sort halledildiğinde navigate çalışıyor
        navigate({
                pathname: location.pathname,        // console.log(location.pathname)       =   /category/Lol/Account/
                search: searchParams.toString(),    // console.log(searchParams.toString()) =   page=1&filter=%257B%2522searchInput%2522%253A%2522%2522%252C%2522Server%2522%253A%255B%2522LAN%2522%255D%252C%2522Champions%2522%253A%2522130%252B%2522%257D
            })

        setGetOffersLock(true) //true olunca getOffers çalışıyor
    }
    
    const searcWithFilter = (credentials:any)=>{ // setState kısmında da sort ve filter var, scope içindekiyle karışmasın diye sonuna '_' ekledim
        const {sort:sort_, ...filter_} = credentials  
        //filter stringify edildi, sort zaten string olduğu için gerek yok
        const stringifiedFilter = JSON.stringify(filter_)

        console.log('stringifiedFilter:', stringifiedFilter) // {"searchInput":"ege","Server":["EUW","NA"],"Rank":null,"Skins":null,"minPrice":"","maxPrice":"","İkinciEl":false}
        console.log('sort:', sort_) // Highest price

        searchParams.set('sort', sort_) 
        searchParams.set('filter',stringifiedFilter)

        const filterNameAndData:FilterSliceAction = { filterName: serviceCategoryName, filterData: stringifiedFilter} // console.log(filterURL) = {"searchInput":"ege","Server":["EUW","NA"]}
        dispatch(editFilter(filterNameAndData))
        const sortNameAndData:SortSliceAction = { sortName: 'OffersPage', sortData: sort_}
        dispatch(editSort(sortNameAndData))
        
        setFilter(stringifiedFilter)
        setSort(sort_)
        
        navigate({
            pathname: location.pathname,        // console.log(location.pathname)       =   /category/Lol/Account/
            search: searchParams.toString(),    // console.log(searchParams.toString()) =   page=1&filter=%257B%2522searchInput%2522%253A%2522%2522%252C%2522Server%2522%253A%255B%2522LAN%2522%255D%252C%2522Champions%2522%253A%2522130%252B%2522%257D
        })

        // sayfa ilk açıldığında currentPage set yapıyoruz
        if(pageURL){
            setCurrentPage(Math.trunc(Number(pageURL))) //önce Number ile paramdaki page stringini çevirdik, sonra Math.trunc ile ondalık kısmı attık
        }

        getOffers(stringifiedFilter,sort_)  //en sonda offerları çekiyorum, filter ve sort eklenince
        console.log('all redux store datası:', allReduxStore)
        console.log('all redux store datası:', allReduxStore)
    }

    
    //OFFER FETCH KISMI
    const [offers, setOffers]= useState<any[]>([])
    const [getOffersLock, setGetOffersLock]= useState<boolean>(false) // filter ve sort set olmadan offer fetch etmeyi engelleyen kilit
    let fetchedOffers:getOffersReturnType
    const getOffers= async(filter:string,sort:string) => {
        //getOffers backend returnu alttaki şekilde
        // {offers:editedResult,totalOfferCount: result.hits.total}
        
        try {
            if(!URLParams.category || !URLParams.service){
                throw new Error("URLParams(category ya da service) yok")
            }
            if(usernameURL){//UserProfilePage'den service tıklanırsa, sadece profilinden tıklanan kullanıcının offerlerını fetch ediyor
                fetchedOffers = await elasticSearch_api.fetchOffersViaElasticSearch(serviceCategoryName,filter,sort,currentPage,usernameURL)
            }else{
                fetchedOffers = await elasticSearch_api.fetchOffersViaElasticSearch(serviceCategoryName,filter,sort,currentPage)
                // await offers_api.fetchOffers(serviceCategoryName,filter,sort)
                
            }
            const {offers,totalOfferCount,limit} = fetchedOffers
            
            setOffers(offers)
            setlastpage(Math.ceil(totalOfferCount/limit))
            if(currentPage<1){    //url page 1den küçükse 1 yapıyor
                setCurrentPage(1)
            }
            else if(Math.ceil(totalOfferCount/limit) < currentPage){ 
                setCurrentPage(Math.ceil(totalOfferCount/limit) < 1
                              ? 1                                //ürün olmazsa page'i 1 yapıyor
                              : Math.ceil(totalOfferCount/limit))//total sayfa 4 olup, url page 4ten büyük olursa offerlar ve pagination kısmı görünmüyor; yani current totalden büyük olunca, current'ı totale eşitliyor
            }

        } catch (error) {
            console.error(error)
            // alert(error+ query)
        }
    }

    //OFFERS COL KISMI
    const offersGrid = <Row  className={`${style.offersRow} `} xs={1} sm={2} md={3} xl={4}>
                                {offers.map(offer => (
                                    <Col key={offer._id}>
                                        <OfferSmall
                                        offerSmall={offer}
                                        />
                                    </Col>
                                ))  }  {/*.slice(startIndex,startIndex + offersPerPAge)*/}
                            </Row>   //slice  [0,30) şeklinde çalışıyor 0.eleman var 30. yok, total 30 eleman

    useEffect(()=>{
        setFilterAndSortOnMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        if(getOffersLock){
            getOffers(filter,sort)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[getOffersLock])

    useEffect(()=>{
        searchParams.set('page',currentPage.toString())
        navigate({
            pathname: location.pathname,
            search: searchParams.toString()})
        
        getOffers(filter,sort)
    },[currentPage])

    return(
        <>
            <Container>
                {/* filter ve sort componentı */}
                <OffersFilterField
                filterData={searchFilters[serviceCategoryName]}
                searchWithFilter={searcWithFilter}
                stringifiedFilter={filter}
                stringifiedSort={sort}
                /> 
                {offers.length>0
                ? <>
                
                <div className={`${style.offersParentDiv}`}>
                    {offersGrid} 
                </div>

                <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                setCurrentPage={setCurrentPage}/>

                </>
                : 
                <p>ürün yok</p>
                }

            
            </Container>
        </>
    )
}

export default OffersPage