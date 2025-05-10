import { Card } from "react-bootstrap";
import { Category as CategoryModel } from "../models/category";
import { Link } from "react-router-dom";
import style from "../styles/Category.module.css"

interface CategoryProps {
    category: CategoryModel,
    //classname: string,
    //onCategoryClicked: (category: CategoryModel) => void,
}

const Category = ({category}:CategoryProps) => {

    const {
        name
    } = category

    return (
        <Card className={`${style.card}`} as={Link} to={"/category/"+ name}
            
            >
            <Card.Body>
                <Card.Title>
                    {name}
                </Card.Title>
                
            </Card.Body>
            
            
        </Card>
    )
}

export default Category