const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");
const currencyService = require("../services/currency.service");

// Create a new wallet
exports.createWallet = async (req, res) => {
  try {
    // Check if user already has a wallet
    const existingWallet = await Wallet.findOne({ 
      userId: req.userId,
      userType: "User"
    });

    if (existingWallet) {
      return res.status(400).json({ 
        message: "User already has a wallet",
        wallet: existingWallet
      });
    }

    // Create new wallet
    const wallet = new Wallet({
      userId: req.userId,
      userType: "User",
      balance: 0,
      history: []
    });

    await wallet.save();

    res.status(201).json({
      message: "Wallet created successfully",
      wallet: {
        id: wallet._id,
        balance: wallet.balance,
        userId: wallet.userId
      }
    });

  } catch (error) {
    console.error("Create wallet error:", error);
    res.status(500).json({ message: "Error creating wallet" });
  }
};

// Currency conversion middleware
exports.withCurrencyConversion = async (req, res, next) => {
    const { displayCurrency } = req.query;
    if (displayCurrency && !currencyService.isSupportedCurrency(displayCurrency)) {
        return res.status(400).json({ 
            message: `Unsupported currency. Supported currencies: ${currencyService.SUPPORTED_CURRENCIES.join(', ')}` 
        });
    }
    req.displayCurrency = displayCurrency;
    next();
};

// Get wallet balance and details
exports.getWalletBalance = async (req, res) => {
  try {
    const { walletId } = req.params;
    const userId = req.userId; // From auth middleware
    
    console.log('Get wallet balance request:', {
      walletId,
      userId,
      headers: req.headers
    });

    const wallet = await Wallet.findOne({ _id: walletId }).exec();
    console.log('Found wallet:', wallet);

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Security check - ensure user can only access their own wallet
    if (wallet.userId.toString() !== userId.toString()) {
      console.log('Access denied. Wallet userId:', wallet.userId, 'Request userId:', userId);
      return res.status(403).json({ message: "Access denied" });
    }

    return res.json({ wallet });

  } catch (error) {
    console.error("Get wallet error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get transaction history with pagination and currency conversion
exports.getTransactions = async (req, res) => {
  try {
    const { walletId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      type,
      displayCurrency,
      startDate,
      endDate,
      minAmount,
      maxAmount
    } = req.query;

    // Build query
    const query = { walletId };
    if (status) query.status = status;
    if (type) query.type = type;
    
    // Add date range if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Add amount range if provided (in wallet's currency)
    if (minAmount || maxAmount) {
      query.convertedAmount = {};
      if (minAmount) query.convertedAmount.$gte = parseFloat(minAmount);
      if (maxAmount) query.convertedAmount.$lte = parseFloat(maxAmount);
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    const total = await Transaction.countDocuments(query);

    // Convert amounts if display currency is different
    let processedTransactions = transactions;
    if (displayCurrency) {
      processedTransactions = await Promise.all(transactions.map(async tx => {
        let displayAmount = tx.amount;
        let rate = 1;

        if (displayCurrency !== tx.sourceCurrency) {
          try {
            displayAmount = await currencyService.convertCurrency(
              tx.amount,
              tx.sourceCurrency,
              displayCurrency
            );
            rate = await currencyService.getExchangeRate(
              tx.sourceCurrency,
              displayCurrency
            );
          } catch (error) {
            console.error(`Currency conversion error for transaction ${tx._id}:`, error);
            // Keep original amount if conversion fails
          }
        }

        return {
          ...tx.toObject(),
          displayAmount: {
            amount: displayAmount,
            currency: displayCurrency,
            exchangeRate: rate,
            formatted: currencyService.formatCurrency(displayAmount, displayCurrency)
          }
        };
      }));
    }

    return res.json({
      transactions: processedTransactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      filters: {
        displayCurrency,
        status,
        type,
        dateRange: startDate || endDate ? { startDate, endDate } : null,
        amountRange: minAmount || maxAmount ? { minAmount, maxAmount } : null
      }
    });

  } catch (error) {
    console.error("Get transactions error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Deduct fare with idempotency check and proper transaction handling
exports.deductFare = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { walletId } = req.params;
    const { amount, currency, idempotencyKey, fareDetails, location } = req.body;
    const userId = req.userId; // From auth middleware

    if (!idempotencyKey) {
      return res.status(400).json({ message: "Idempotency key required" });
    }

    // Check for existing transaction with same idempotency key
    const existingTx = await Transaction.findOne({ idempotencyKey }).session(session);
    if (existingTx) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({ 
        transaction: existingTx,
        message: "Transaction already processed"
      });
    }

    // Get wallet with lock for update
    const wallet = await Wallet.findOne({ _id: walletId }).session(session);
    if (!wallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Security check
    if (wallet.userId.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Access denied" });
    }

    // Check sufficient funds
    if (wallet.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(402).json({ message: "Insufficient funds" });
    }

    // Create transaction record
    const transaction = new Transaction({
      walletId,
      userId: wallet.userId,
      userType: wallet.userType,
      type: 'fare',
      status: 'pending',
      amount,
      sourceCurrency: currency,
      targetCurrency: currency, // Same currency for now
      idempotencyKey,
      sourceLocation: location,
      fareDetails
    });

    // Deduct amount and save all changes atomically
    wallet.balance -= amount;
    wallet.history.push({
      title: 'Fare deduction',
      amount: -amount,
      uuid: idempotencyKey,
      date: new Date(),
      remarks: fareDetails?.description || 'Transit fare'
    });

    // Save both wallet and transaction
    await wallet.save({ session });
    transaction.status = 'completed';
    await transaction.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.json({ 
      transaction,
      wallet: {
        id: wallet._id,
        balance: wallet.balance,
        currency
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Deduct fare error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};