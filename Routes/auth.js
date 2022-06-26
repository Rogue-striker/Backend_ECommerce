import express from "express";
import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import { saltrounds } from "../Configs/config.js";
import RefreshTokenGenerator from "./../Helpers/RefreshTokenGenerator.js";
import AccessTokenGenerator from "../Helpers/AccessTokenGenerator.js";

const Router = express.Router();

// * Get All Users 
Router.get("/", (req, res) => {
  User.find({}, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

// * register router - /auth/register
Router.post("/register", async (req, res) => {
   console.log(req.body);
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    res.status(409).json({
      error : "empty data fields",
    });
  } else {
    User.findOne({ email }, async (error, result) => {
      if (error) {
        res.status(400).json({
          error : "error in processing",
        });
      } else if (result) {
        res.status(409).json({
           error : "user already exists please try again",
        });
      } else {
        const salt = await bcrypt.genSalt(saltrounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          phone,
        });
        newUser
          .save()
          .then(() => {
            res.status(201).json({
               success : "registration successful",
            });
          })
          .catch((e) => {
            console.log(e);
            res.status(400).json({
                error : "error in processing",
            });
          });
      }
    });
  }
});

// * login router - /auth/login
Router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, async (err, user) => {
    if (err) {
      res.status(400).json({
        error: "db error occured",
      });
    } else if (!user) {
      res.status(400).json({
        error: "user not found",
      });
    } else {
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        const RefreshToken = RefreshTokenGenerator(user._id);
        const AccessToken = AccessTokenGenerator(user._id);
        if (isMatch) {
        

          res.status(200).cookie("refreshToken", RefreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          }).json({
            'success': "login successful",
            'accessToken': AccessToken,  
          });
        } else {
          res.status(400).json({
            error: "password incorrect",
          });
        }
      } catch (e) {
        res.status(400).json({
          message: "error occured",
        });
      }
    }
  });
});

// * logout router - /auth/logout
Router.get("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({
    message: "logged out",
  });
});


// ** delete all users 
Router.delete("/delete", (req, res) => {
  User.deleteMany({}, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(result);
    }
  });
}
);


export default Router;


