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
    const { token } = req.body;

    // uncomment this on prod
    // jwt.verify(token, process.env.TRANSITPAY_TOKEN_GENERATION_SECRET);

    const decoded = jwt.decode(token);

    const userId = decoded._id;
    const userType = decoded._userType;

    const wallet = await Wallet.find({ userType, userId });

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