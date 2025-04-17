import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import 'dotenv/config'
import connectDB from './config/db.js';
import userRouter from './routes/userroute.js';
import imageRouter from './routes/imageroutes.js';

const app=express();
const PORT=process.env.PORT|| 4000;

app.use(express.json());
app.use(cors());

await connectDB()
app.use('/api/user',userRouter);
app.use('/api/image',imageRouter);

app.get('/',(req,res)=>res.send('Api working fine'));

app.listen(PORT ,()=>{
    console.log("SErver running on port "+PORT);
})