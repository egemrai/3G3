import { Card } from "react-bootstrap";
import { Service as ServiceModel } from "../models/service";
import { Link } from "react-router-dom";
import style from "../styles/Service.module.css"


interface ServiceProps{
    service: ServiceModel,
}

const Service= ({service}:ServiceProps) => {

    const{categoryName,
        serviceName
    } = service

return(
<>
<Card className={`${style.card}`} as={Link} to={"/category/"+ categoryName +"/"+ serviceName+ "/?page=1"} //page=1 ekledim next previous offer için, olmazsa düzelt
>
    <Card.Body >
        <Card.Title >
            {`${serviceName}`}
        </Card.Title>
    </Card.Body>
</Card>
</>
)
}

export default Service