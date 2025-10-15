const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: String,
    resource: { 
        type: String, 
        required: true 
    },
    action: { 
        type: String, 
        enum: ['create', 'read', 'update', 'delete', 'manage'],
        required: true 
    }
}, { timestamps: true });

// Compound unique index
permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

module.exports = mongoose.model('Permission', permissionSchema);