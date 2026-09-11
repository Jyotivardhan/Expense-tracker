import {Router} from "express";
import{
    createExpense,
    listExpenses,
    getExpense,
    updateExpense,
    deleteExpense
} from "../controllers/expense.controller.js"

const router = Router()

router.route('/').post(createExpense).get(listExpenses);
router.route('/:id').get(getExpense).put(updateExpense).delete(deleteExpense);

export default router;