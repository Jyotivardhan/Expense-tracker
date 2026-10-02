import {Router} from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from '../middleware/validate.middleware.js';
import{
    createExpense,
    listExpenses,
    getExpense,
    updateExpense,
    deleteExpense,
    summary
} from "../controllers/expense.controller.js";
import{
    createExpenseSchema,
    updateExpenseSchema,
    listExpensesQuerySchema
} from '../validators/expense.validator.js'

const router = Router();
router.use(protect);

router.get('/summary', summary);

router.route('/').get(validate(listExpensesQuerySchema, 'query'), listExpenses).post(validate(createExpenseSchema),createExpense);
router.route('/:id').get(getExpense).put(validate(updateExpenseSchema),updateExpense).delete(deleteExpense);

export default router;