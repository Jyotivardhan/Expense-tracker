import express from "express"
import expenseRoutes from './routes/expense.routes.js'

const app = express()

app.use(express.json());
app.get('/' , (req,res)=>{
    res.json({message: 'Expense Tracker API is running'})
});

app.get('/health', (req,res)=>{
    res.json({status: 'ok'})
});

app.use('/api/expenses' , expenseRoutes);


export default app;