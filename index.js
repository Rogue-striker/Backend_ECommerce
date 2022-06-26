import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";


// * Routes
import auth from "./Routes/auth.js";
import Public from "./Routes/public.js";
import PrivateRoute from "./Routes/private.js";

// * env config
dotenv.config();

// * express config
const app = express();

// * mongoose connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });


const corsOptions ={
    origin:['http://localhost:3000','https://theclothingstore.netlify.app'], 
    credentials:true,             
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization','Accept','Origin','X-Requested-With','Access-Control-Allow-Origin','Access-Control-Allow-Credentials']
  }
// * middlewares


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/auth", auth);
app.use("/", PrivateRoute);
app.use("/", Public);

// * port config
app.listen(5000, () => {
  console.log("server is running on port 5000");
});
