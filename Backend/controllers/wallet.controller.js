const mongoose = require("mongoose");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");
const currencyService = require("../services/currency.service");

// Currency conversion middleware
const withCurrencyConversion = async (req, res, next) => {
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
    
    // Try finding by walletId first, then fallback to userId if provided
    let wallet;
    if (walletId) {
      wallet = await Wallet.findById(walletId);
    } else if (req.userId) {
      wallet = await Wallet.findOne({ userId: req.userId });
    } else {
      return res.status(400).json({ message: "walletId or authenticated user required" });
    }

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Check if user has access to this wallet
    if (wallet.userId.toString() !== req.userId && !req.user?.role === "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Convert balance if display currency is different
    let displayBalance = wallet.balance;
    let rate = 1;

    if (req.displayCurrency && req.displayCurrency !== wallet.currency) {
      try {
        displayBalance = await currencyService.convertCurrency(
          wallet.balance,
          wallet.currency,
          req.displayCurrency
        );
        rate = await currencyService.getExchangeRate(wallet.currency, req.displayCurrency);
      } catch (convError) {
        console.error("Currency conversion error:", convError);
        return res.status(400).json({ message: "Currency conversion failed" });
      }
    }

    return res.status(200).json({ 
      wallet,
      displayBalance: {
        amount: displayBalance,
        currency: req.displayCurrency || wallet.currency,
        exchangeRate: rate,
        formatted: currencyService.formatCurrency(displayBalance, req.displayCurrency || wallet.currency)
      }
    });
  } catch (error) {
    console.error("Get wallet error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a wallet for an owner (ownerType: User|Org|Ward)
exports.createWallet = async (req, res) => {
  try {
    const { ownerType, ownerId, currency } = req.body;
    if (!ownerType || !ownerId) {
      return res.status(400).json({ message: "ownerType and ownerId required" });
    }

    // prevent duplicate wallets per owner
    const existing = await Wallet.findOne({ userType: ownerType, userId: ownerId });
    if (existing) {
      return res.status(409).json({ message: "Wallet already exists", wallet: existing });
    }

    const wallet = new Wallet({ userType: ownerType, userId: ownerId, currency: currency || "NPR" });
    await wallet.save();
    return res.status(201).json({ wallet });
  } catch (error) {
    console.error("Create wallet error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Top up wallet (stub - payment integration coming later)
exports.topupStub = async (req, res) => {
  const { walletId } = req.params;
  const { amount, currency = "NPR", idempotencyKey, method = "test", meta } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check idempotency
    if (idempotencyKey) {
      const existing = await Transaction.findOne({ idempotencyKey });
      if (existing) {
        return res.status(200).json({ transaction: existing });
      }
    }

    // Get wallet to check its currency
    const targetWallet = await Wallet.findById(walletId);
    if (!targetWallet) {
      throw new Error("Wallet not found");
    }

    // Convert amount if currencies differ
    let convertedAmount = amount;
    let rate = 1;
    
    if (currency !== targetWallet.currency) {
      convertedAmount = await currencyService.convertCurrency(amount, currency, targetWallet.currency);
      rate = await currencyService.getExchangeRate(currency, targetWallet.currency);
    }

    // 1) Create transaction with currency conversion details
    const tx = new Transaction({
      walletId,
      type: "topup",
      amount: Math.abs(amount),
      sourceCurrency: currency,
      targetCurrency: wallet.currency,
      convertedAmount: Math.abs(convertedAmount),
      exchangeRate: {
        fromCurrency: currency,
        toCurrency: wallet.currency,
        rate: rate,
        timestamp: new Date()
      },
      method,
      status: "pending",
      idempotencyKey,
      meta: {
        ...meta,
        originalAmount: amount,
        originalCurrency: currency
      }
    });
    await tx.save({ session });

    // 2) Update wallet (in production this would happen after payment confirmation)
    const wallet = await Wallet.findByIdAndUpdate(
      walletId,
      {
        $inc: { balance: amount },
        $push: {
          history: {
            title: "topup",
            amount: amount,
            uuid: tx._id,
            date: new Date()
          }
        }
      },
      { new: true, session }
    );

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // 3) Complete transaction
    tx.status = "completed";
    await tx.save({ session });

    await session.commitTransaction();
    return res.status(201).json({ 
      transaction: tx,
      wallet,
      message: "Note: This is a test top-up. In production, this would require payment confirmation."
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Top-up error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
};

// Deduct fare with atomic transaction
exports.deductFare = async (req, res) => {
  const { walletId } = req.params;
  const { amount, currency = "NPR", idempotencyKey, meta } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  // Check idempotency
  if (idempotencyKey) {
    const existing = await Transaction.findOne({ idempotencyKey });
    if (existing) {
      return res.status(200).json({ transaction: existing });
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get wallet currency and convert amount if needed
    const sourceWallet = await Wallet.findById(walletId);
    if (!sourceWallet) {
      throw new Error("Wallet not found");
    }

    // Convert amount if currencies differ
    let convertedAmount = amount;
    let rate = 1;
    
    if (currency !== sourceWallet.currency) {
      convertedAmount = await currencyService.convertCurrency(amount, currency, sourceWallet.currency);
      rate = await currencyService.getExchangeRate(currency, sourceWallet.currency);
    }

    // 1) Create pending transaction with currency details
    const tx = new Transaction({
      walletId,
      type: "fare",
      amount: -Math.abs(amount),
      sourceCurrency: currency,
      targetCurrency: sourceWallet.currency,
      convertedAmount: -Math.abs(convertedAmount),
      exchangeRate: {
        fromCurrency: currency,
        toCurrency: sourceWallet.currency,
        rate: rate,
        timestamp: new Date()
      },
      status: "pending",
      idempotencyKey,
      meta: {
        ...meta,
        originalAmount: amount,
        originalCurrency: currency,
        fareDetails: {
          baseAmount: amount,
          ...meta?.fareDetails
        }
      }
    });
    await tx.save({ session });

    // 2) Attempt atomic wallet update with sufficient balance check
    const wallet = await Wallet.findOneAndUpdate(
      { 
        _id: walletId,
        balance: { $gte: amount }  // Ensure sufficient balance
      },
      {
        $inc: { balance: -amount },
        $push: { 
          history: {
            title: "fare",
            amount: -amount,
            uuid: tx._id,
            date: new Date()
          }
        }
      },
      { new: true, session }
    );

    if (!wallet) {
      // Insufficient funds
      tx.status = "failed";
      await tx.save({ session });
      await session.commitTransaction();
      return res.status(402).json({ message: "Insufficient funds" });
    }

    // 3) Mark transaction complete
    tx.status = "completed";
    await tx.save({ session });

    await session.commitTransaction();
    return res.json({ transaction: tx, wallet });

  } catch (error) {
    await session.abortTransaction();
    console.error("Deduct fare error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
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