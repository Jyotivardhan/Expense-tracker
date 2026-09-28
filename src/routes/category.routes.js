import {Router} from 'express' ;
import {protect} from '../middleware/auth.middleware.js'
import{
    listCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js'

const router = Router()

router.use(protect)

router.route('/')
.get(listCategories)
.post(createCategory)

router.route('/:id')
.put(updateCategory)
.delete(deleteCategory)

export default router;