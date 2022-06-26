import express from "express";
import TokenVerifier from "../Middlewares/TokenVerifier.js";
import Product from "../Models/ProductModel.js";

const Router = express.Router();

Router.get('/Buyproduct',TokenVerifier,(req, res)=>{
    Product.findOne({}, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            console.log("result");
            res.json(result);
        }
    })
})

export default Router;