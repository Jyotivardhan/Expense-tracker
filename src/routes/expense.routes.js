import {Router} from "express";
import { protect } from "../middleware/auth.middleware.js";
import{
    createExpense,
    listExpenses,
    getExpense,
    updateExpense,
    deleteExpense
} from "../controllers/expense.controller.js"

const router = Router();
router.use(protect);

router.route('/').post(createExpense).get(listExpenses);
router.route('/:id').get(getExpense).put(updateExpense).delete(deleteExpense);

export default router;