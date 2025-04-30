import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';
import cors from 'cors';

import authRoute from './routes/auth.routes.js';
import blogRoute from './routes/blog.routes.js';
import  connectDB from "./db/index.js";


dotenv.config();
const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || " http://localhost:5173/",  // ✅ match frontend port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve('public')));
const PORT = process.env.PORT || 3000;



app.use('/api/auth', authRoute);
app.use('/api/auth', blogRoute);

app.listen(PORT, () =>{
  // console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
})
