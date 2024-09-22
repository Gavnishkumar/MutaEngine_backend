const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Transaction = require('../models/Transaction');


const AddTransaction = asyncHandler(async (req, res) => {
    const { user,name, transactionId, amount, email, status, remarks, paymentMethod, currency } = req.body;
  
    try {
      const newTransaction = new Transaction({
        user,
        name,
        transactionId,
        amount,
        email,
        status,
        remarks,
        paymentMethod,
        currency,
      });
  
      const savedTransaction = await newTransaction.save();
      res.status(201).json(savedTransaction);
    } catch (error) {
      res.status(500).json({ message: 'Error adding transaction', error });
    }
  });

const FetchTransaction = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    try {
      const transaction = await Transaction.findOne({transactionId:transactionId});
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      res.json(transaction);
    } catch (error) {
   
      res.status(500).json({ message: 'Error fetching transaction', error });
    }
  });
  const FetchAllTransaction = asyncHandler(async (req, res) => {
    const { userId } = req.params; // Extract userId from the request parameters

    try {
        const transactions = await Transaction.find({ user: userId }); // Query for transactions with the specified userId
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user.' });
        }
        res.json(transactions); // Respond with the found transactions
    } catch (error) {
        
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
});


module.exports={AddTransaction,FetchTransaction,FetchAllTransaction}