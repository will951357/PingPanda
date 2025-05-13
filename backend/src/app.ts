import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/internal/authRoute';
import userRouter from './routes/internal/userRoute';
import catRouter from './routes/internal/categoriesRoute';
import eventRouter from './routes/public/v1/eventsRoutes';
import eventsRouter from './routes/internal/eventsRoutes';
import payRouter from './routes/internal/paymentRoute';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
    
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/category', catRouter)
app.use('/events', eventsRouter)
app.use('/payment', payRouter)

// acesso publico
app.use('/api/v1', eventRouter)


export default app

