const express = require('express');
const { registerUser,authUser } = require('../controller/userControllers');
const protect = require('../middleware/authmiddleware');
const { AddTransaction, FetchAllTransaction, FetchTransaction } = require('../controller/transactionController');

const router= express.Router();
router.route('/add-transaction').post(AddTransaction);
router.route('/fetch/:transactionId').get(FetchTransaction);
router.route('/fetch-all/:userId').get(FetchAllTransaction);
module.exports=router;
