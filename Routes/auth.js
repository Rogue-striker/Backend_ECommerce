import express from 'express';
import User from '../Models/User.js';
import bcrypt from 'bcrypt';
import { saltrounds } from '../Configs/config.js';
import RefreshTokenGenerator from './../Helpers/RefreshTokenGenerator.js';
import AccessTokenGenerator from '../Helpers/AccessTokenGenerator.js';

const Router = express.Router();

// * Get All Users 333
Router.get("/", (req, res)=>{
    User.findOne({}, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            console.log("result");
            res.json(result);
        }
    })
})

// * register router - /auth/register 
Router.post('/register',(req,res)=>{
    const {name, email, password, phone} = req.body;
    bcrypt.hash(password, saltrounds, (err, hash) => {
        if(err){
            res.status(400).json({
                message : "hashing error occured"
            })
        }
        else{
            const newuser = new User({
                name,
                email,
                password:hash,
                phone
            })
            newuser.save().then(
                ()=>{
                    res.status(200).json({
                        message : "user registered",
                    
                    });
                }
            ).
            catch((e)=>{
                console.log(e);
                res.status(200).json({
                    message : "user not registered"
                })
            }
            )
        }
    });

})

// * login router - /auth/login 
Router.post("/login",(req, res)=>{
    const {email, password} = req.body;
    User.findOne({email:email},(err, user)=>{
        if(err){
            res.status(400).json({
                message : "db error occured"
            })
        }
        else if(!user){
            res.status(400).json({
                message : "user not found"
            })
        }
        else{
            try{
                const isMatch = bcrypt.compare(password, user.password);
                console.log(user._id);
                const RefreshToken = RefreshTokenGenerator(user._id);
                const AccessToken = AccessTokenGenerator(user._id);
                if(isMatch){
                    res.cookie("refreshToken", RefreshToken, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
                    })
        
                    res.status(200).json({
                        message : "login successful",
                        accessToken : AccessToken,
                        refreshToken : RefreshToken
                    })
                }
                else{
                    res.status(201).json({
                        message : "password incorrect"

                    })
                }
            }
            catch(e){
                res.status(400).json({
                    message : "error occured"
                })   
            }
        }
    })
})

// * logout router - /auth/logout 
Router.get("/logout",(req, res)=>{
    res.clearCookie("refreshToken");
    res.status(200).json({
        message : "logged out"
    });
})

export default Router;


// 9032459599 
