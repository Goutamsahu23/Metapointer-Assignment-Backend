const express=require('express');
const router=express.Router();


const {login,signup}=require('../controllers/auth')
const {sendMoney}=require('../controllers/sendMoney');
const {auth}=require('../middlewares/auth')
const{userDetails,userTransaction}=require("../controllers/dashboard")





router.post('/login',login);
router.post('/signup',signup);
router.post('/sendMoney',auth,sendMoney);
router.get('/dashboard', auth,userDetails );
router.get('/transactions', auth,userTransaction );


module.exports=router;