import express from "express"
import expenseRoutes from './routes/expense.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(express.json());

app.get('/' , (req,res)=>{
    res.json({message: 'Expense Tracker API is running'})
});

app.get('/health', (req,res)=>{
    res.json({status: 'ok'})
});

app.use('/api/expenses' , expenseRoutes);
app.use('/api/auth' , authRoutes)


export default app;