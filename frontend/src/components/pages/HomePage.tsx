import { Container } from "react-bootstrap"
import style from "../../styles/HomePage.module.css"
import { useEffect } from "react"

const HomePage = ()=>{

    const browsingHistoryCol= 2

    useEffect(()=>{
        document.body.style.backgroundColor= "#FAFAFA"
    },[])

    return(
        <>
        <img className={`${style.img}`}
            src="https://media.licdn.com/dms/image/C4D12AQGDOOyHZm7ggQ/article-cover_image-shrink_600_2000/0/1624893322758?e=2147483647&v=beta&t=rxr_2gfYyCOaj-pTPauAW-USDMDz960iV4RwxVy0m3I"  
            alt= {"annen"}/>   
        
        <Container className={`${style.historyContainer}`}>
            <h1 className={`${style.historyTitle}`}>Browsing History</h1>
        </Container>
        
        </>

        
        
    )
}

export default HomePage