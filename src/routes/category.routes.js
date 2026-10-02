import {Router} from 'express' ;
import {protect} from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js';
import{
    listCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';
import{
    createCategorySchema,
    updateCategorySchema
} from '../validators/category.validator.js'

const router = Router()

router.use(protect)

router.route('/')
.get(listCategories)
.post(validate(createCategorySchema), createCategory)

router.route('/:id')
.put(validate(updateCategorySchema), updateCategory)
.delete(deleteCategory)

export default router;