const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required:true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensure each transaction has a unique ID
    },
    amount: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true, // Store emails in lowercase
    },
    date: {
      type: Date,
      default: Date.now, // Automatically set the date to now
    },
    status: {
      type: String, // Transaction status
      default: 'pending',
    },
    remarks: {
      type: String,
      default: '', // Optional description of the transaction
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'bank transfer', 'paypal'], // Example payment methods
      required: true,
      default: 'card',
    },
    currency: {
      type: String,
      default: 'USD', // Default currency
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
