import express from "express"
import * as CategoriesController from "../controllers/categoriesC"

const router = express.Router();

router.get("/", CategoriesController.getCategories);



router.get("/:categoryName", CategoriesController.getServices);





export default router
