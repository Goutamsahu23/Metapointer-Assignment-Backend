const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require("jsonwebtoken");
require('dotenv').config();

// signup handler
exports.signup=async(req,res)=>{
    try{
        const {name,phoneNum,amount,password}=req.body;
        const existingUser = await User.findOne({ phoneNum });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user already exist"
            })
        }

        if (!phoneNum || !password || !name || !amount ) {
            return res.status(400).json({
                success: false,
                message: "please fill the data."
            })
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "error in hashing password"
            })
        }

        const user = await User.create({
            name, phoneNum, password: hashedPassword, amount,
        })

        res.status(200).json({
            success: true,
            message: "signup successfully."
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            message: "user not registered please try again..."
        })

    }
}

// login
exports.login = async (req, res) => {
    try {

        const { phoneNum, password } = req.body;
        if (!phoneNum || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill the data."
            })
        }

        let user = await User.findOne({ phoneNum });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. or new user"
            });
        }
        const payload = {
            phoneNum: user.phoneNum,
            _id: user._id,
            amount:user.amount
        }
        // verify password and generate jwt
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(payload,
                process.env.JWT_TOKEN,
                {
                    expiresIn: "2h"
                });


            user = user.toObject();
            user.token = token;
            user.password = undefined;



            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
              };
              
              res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user,
                message: `Welcome Back !! ${user.name}`
              });
              


        } else {
            res.status(403).json({
                success: false,
                message: "password incorrect."
            })
        }

    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            message: "login failed",
            success: false,
        })

    }
}