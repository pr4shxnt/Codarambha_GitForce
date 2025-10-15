const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: String,
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    isSystem: {
        type: Boolean,
        default: false
    },
    meta: {
        maxTransactionAmount: Number,  // Maximum amount per transaction
        dailyLimit: Number,            // Daily transaction limit
        monthlyLimit: Number,          // Monthly transaction limit
        allowedCurrencies: [String],   // Allowed currencies for transactions
        restrictedFeatures: [String]   // Features this role cannot access
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual for checking if role is admin
roleSchema.virtual('isAdmin').get(function() {
    return this.name === 'admin';
});

// Pre-save middleware to ensure system roles can't be modified
roleSchema.pre('save', function(next) {
    if (this.isSystem && this.isModified('permissions')) {
        const err = new Error('System roles cannot be modified');
        return next(err);
    }
    next();
});

module.exports = mongoose.model('Role', roleSchema);