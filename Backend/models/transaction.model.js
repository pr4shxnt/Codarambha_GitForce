const mongoose = require("mongoose");

// Location schema for tap-in/tap-out points
const locationSchema = new mongoose.Schema({
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    stationName: String,
    zoneId: String
}, { _id: false });

// Exchange rate snapshot for historical accuracy
const exchangeRateSchema = new mongoose.Schema({
    fromCurrency: { type: String, required: true },
    toCurrency: { type: String, required: true },
    rate: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

// Enhanced transaction schema with detailed logging
const transactionSchema = new mongoose.Schema({
    // Core transaction details
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: false },
    userType: { type: String, enum: ["User", "Org", "Ward"], required: false },
    
    // Transaction type and status
    type: { 
        type: String, 
        enum: ["topup", "fare", "refund", "adjustment", "transfer", "fee"], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "completed", "failed", "reversed", "disputed"], 
        default: "pending" 
    },
    
    // Amount and currency information
    amount: { type: Number, required: true }, // Amount in source currency
    sourceCurrency: { type: String, enum: ["NPR", "INR", "USD"], required: true },
    targetCurrency: { type: String, enum: ["NPR", "INR", "USD"], required: true },
    convertedAmount: { type: Number }, // Amount in target currency
    exchangeRate: { type: exchangeRateSchema }, // Snapshot of exchange rate used
    
    // Payment details
    method: { type: String }, // payment method used
    reference: { type: String }, // payment provider reference
    idempotencyKey: { type: String, index: true, sparse: true },
    
    // Location data (for tap-in/tap-out)
    sourceLocation: { type: locationSchema },
    destinationLocation: { type: locationSchema },
    
    // Fare details
    fareDetails: {
        baseAmount: Number,
        distance: Number, // in meters
        duration: Number, // in seconds
        zonesCrossed: [String],
        discounts: [{
            type: String,
            amount: Number,
            reason: String
        }]
    },
    
    // Metadata and audit
    meta: { type: mongoose.Schema.Types.Mixed },
    notes: [{ 
        message: String,
        timestamp: { type: Date, default: Date.now },
        author: String
    }],
    
    // For refunds and disputes
    relatedTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    disputeDetails: {
        reason: String,
        status: { type: String, enum: ['open', 'resolved', 'rejected'] },
        resolution: String,
        resolvedAt: Date
    }
}, { 
    timestamps: true,
    
    // Add compound indexes for common queries
    indexes: [
        { walletId: 1, createdAt: -1 },
        { userId: 1, type: 1, status: 1 },
        { sourceCurrency: 1, targetCurrency: 1, createdAt: -1 }
    ]
});

module.exports = mongoose.model("Transaction", transactionSchema);