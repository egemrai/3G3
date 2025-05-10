import { useEffect, useState } from "react"

const NotFoundPage = () => {


const [stringifiedİnsan, setstringifiedİnsan] = useState("")
const [insanParse, setinsanParse] = useState("")

    interface Insan{
        isim: string,
        yaş: number,
        soyisim: string,
        boy: boolean
    }

    const insan= {
        isim:"ege",
        yaş: 22,
        soyisim:"egemuge",
        boy: false
    }

    


     async function stringify(bir: Insan) {
        return  await JSON.stringify(bir)   
    }

    // async function parse(iki:string) {
    //     return await JSON.parse(iki)  
    // }


    // async function awaitFalan(){
    //     setstringifiedİnsan(await stringify(insan))

    //     setinsanParse(JSON.parse( stringifiedİnsan))
    // }

    const awaitFalan = async () =>{
       setstringifiedİnsan(await stringify(insan))

        // setinsanParse(JSON.parse( stringifiedİnsan))
    }
    
    
    // awaitFalan()
    

    useEffect(() => {
        awaitFalan()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])



    return (
        <div>
            <p>page not found</p>
            <p>{`${stringifiedİnsan}`}</p>
            <p>{`${insanParse}`}</p>
        </div>
    );
}
 
export default NotFoundPage;