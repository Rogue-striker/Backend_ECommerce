import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'

// * Models 
import User from "./Models/User.js";

// * Routes 
import auth from "./Routes/auth.js";
import Public from "./Routes/public.js";
import PrivateRoute from './Routes/private.js';

// * env config 
dotenv.config();

// * express config
const app = express();

// * mongoose connection 
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log('connected to mongo');
})

// * middlewares 
app.use(express.json());
app.use(cors());
app.use("/auth", auth);
app.use("/", PrivateRoute);
app.use("/", Public);

// * port config 
app.listen(5000,()=>{
    console.log("server is running on port 5000");
})