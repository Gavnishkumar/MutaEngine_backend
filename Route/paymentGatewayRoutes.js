const express = require('express');
const protect = require('../middleware/authmiddleware');
const router= express.Router();
const {paymentIntent}= require('../controller/paymentController');
router.route('/create-payment-intent').post(protect,paymentIntent);
module.exports=router;
