import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Category as CategoryModel } from "../../models/category";
import * as OffersApi from "../../network/offers_api"
import { Col, Container, Row } from "react-bootstrap";
import Category from "../Category";

const CategoryPage = () => {
    // const URLcategory= useParams<{category: string}>() //URLdeki :category datasını alıyoruz
    
    const [categories, setCategories] = useState<CategoryModel[]>([])

    useEffect(() => {
        document.body.style.backgroundColor= "#FAFAFA"
        async function loadOffers() {
          try {
          const fetchedCategories = await OffersApi.fetchCategories()
            setCategories(fetchedCategories)
          } catch (error) {
            console.error(error)
          }
        }
        loadOffers()
      }, [])

      const categoriesGrid = 
    <Row  xs={1} md={2} xl={3} >
      {categories.map(category => (
        <Col key={category._id}>
          <Category
          category= {category} 
          
          />
        </Col>
      ))}
    </Row>


    return (   
        <>
          <Container>
            { categories.length >0
                ? categoriesGrid
                : <p>You don't have any categories yet</p>
            }
            <div>
                <p>All categories:</p>
            </div> 
            {/* <Routes>
                <Route
                  path={URLcategory.category}
                  element={
                    <ServicesContainer />
                  }
                />
            </Routes> */}
        
          </Container>     
        </>
       
    );
}


 
export default CategoryPage;