import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Service as ServiceModel } from "../models/service"
import * as OffersApi from "../network/offers_api"
import { Col, Container, Row } from "react-bootstrap"
import Service from "./Service"

const ServicesContainer = () => {
    const URLcategory= useParams<{category: string}>()
    
    const [services, setServices] = useState<ServiceModel[]>([])


    useEffect(() => {
     
        async function getServices(){
            try {
                if(!URLcategory.category){
                    throw new Error("URLcategory yok")
                }
                const fetchedServices = await OffersApi.fetchServices(URLcategory.category)
                setServices(fetchedServices)
                    
            } catch (error) {
                console.error(error)
            }
            }
        getServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])   //URLcategory.category ekledim buraya denemek için bakıcaz

    const servicesGrid=
    <Row sm={1} md={2} xl={3}>
        {services.map(service => (
            <Col key={service._id}>
                <Service
                service={service}
                />
            </Col>
        ))}   
    </Row>

    return(
        <>
            <Container>
                {services.length>0
                    ? servicesGrid
                    : <p> services 0'dan fazla üyesi yok</p>}

                <div>
                    <p>{URLcategory.category} services</p>
                </div>

            </Container>
        </>
    )

    
}

export default ServicesContainer