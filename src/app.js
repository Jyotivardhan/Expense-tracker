import express from "express"
import expenseRoutes from './routes/expense.routes.js'
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'
import {notFound, errorHandler} from './middleware/error.middleware.js'


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
app.use('/api/categories', categoryRoutes)

app.use(notFound);
app.use(errorHandler);


export default app;