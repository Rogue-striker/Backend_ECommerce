import express from "express";

// * models imports 
import Product from './../Models/ProductModel.js';

const Router = express.Router();


// * for all products 
Router.get("/users",(req, res)=>{
    
});

// * for a category 
Router.get("/category",(req, res)=>{   
    res.send("Category");
})

//  * for a specific product 
Router.post("/getproduct",(req, res)=>{
    res.send("Specific Product");
})

// * for adding products 
Router.post("/AddProducts", (req, res)=>{
    const {name,price, category, description ,image, quantity} = req.body;
    const newproduct = new Product({
        name,
        price,
        category,
        description,
        image,
        quantity
    })
    newproduct.save().then(
        ()=>{
            res.status(200).json({
                message : "product added"
            });
        }
    ).
    catch((e)=>{
        console.log(e);
        res.status(200).json({
            message : "product not added"
        })
    }
    )
})
Router.post("/products",(req,res)=>{
    res.send("all products")
})

export default Router;