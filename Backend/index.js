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
  origin:"https://final-project-p9rgqg8fc-pushpaks-projects-481b28fb.vercel.app",  // ✅ match frontend port
  credentials: true,
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
