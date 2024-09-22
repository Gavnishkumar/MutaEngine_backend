const express = require('express');
const { registerUser,authUser } = require('../controller/userControllers');
const protect = require('../middleware/authmiddleware');
const { AddTransaction, FetchAllTransaction, FetchTransaction } = require('../controller/transactionController');

const router= express.Router();
router.route('/add-transaction').post(protect,AddTransaction);
router.route('/fetch/:transactionId').get(protect,FetchTransaction);
router.route('/fetch-all/:userId').get(protect,FetchAllTransaction);
module.exports=router;
