const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const { clearPermissionCache } = require('../middlewares/rbac.middleware');

// Default permissions by resource
const DEFAULT_PERMISSIONS = {
    wallet: ['create', 'read', 'update', 'delete', 'manage'],
    transaction: ['create', 'read', 'update', 'manage'],
    user: ['create', 'read', 'update', 'delete', 'manage'],
    role: ['create', 'read', 'update', 'delete', 'manage'],
    permission: ['create', 'read', 'update', 'delete', 'manage']
};

// Default roles with their permissions
const DEFAULT_ROLES = {
    admin: {
        description: 'Super administrator with full access',
        permissions: ['*'],
        isSystem: true,
        meta: {
            maxTransactionAmount: null, // No limit
            dailyLimit: null,
            monthlyLimit: null,
            allowedCurrencies: ['NPR', 'INR', 'USD']
        }
    },
    rider: {
        description: 'Regular transit user',
        permissions: [
            { resource: 'wallet', actions: ['read'] },
            { resource: 'transaction', actions: ['read', 'create'] }
        ],
        meta: {
            maxTransactionAmount: 10000,
            dailyLimit: 20000,
            monthlyLimit: 100000,
            allowedCurrencies: ['NPR']
        }
    },
    driver: {
        description: 'Transit vehicle driver',
        permissions: [
            { resource: 'transaction', actions: ['read', 'create'] },
            { resource: 'wallet', actions: ['read'] }
        ],
        meta: {
            restrictedFeatures: ['topup', 'refund']
        }
    },
    support: {
        description: 'Customer support staff',
        permissions: [
            { resource: 'wallet', actions: ['read'] },
            { resource: 'transaction', actions: ['read', 'update'] },
            { resource: 'user', actions: ['read'] }
        ],
        meta: {
            maxTransactionAmount: 5000, // Limit for adjustments/refunds
        }
    }
};

/**
 * Initialize default permissions
 */
async function initializePermissions() {
    const permissions = [];

    // Create permissions for each resource and action
    for (const [resource, actions] of Object.entries(DEFAULT_PERMISSIONS)) {
        for (const action of actions) {
            const name = `${resource}:${action}`;
            const permission = await Permission.findOneAndUpdate(
                { resource, action },
                {
                    name,
                    description: `Allows ${action} operations on ${resource}`,
                    resource,
                    action
                },
                { upsert: true, new: true }
            );
            permissions.push(permission);
        }
    }

    return permissions;
}

/**
 * Initialize default roles
 */
async function initializeRoles(permissions) {
    // Create permission lookup map
    const permissionMap = permissions.reduce((map, p) => {
        map[`${p.resource}:${p.action}`] = p._id;
        return map;
    }, {});

    // Create each default role
    for (const [roleName, roleData] of Object.entries(DEFAULT_ROLES)) {
        const rolePermissions = [];

        // Handle wildcard permissions for admin
        if (roleData.permissions.includes('*')) {
            rolePermissions.push(...permissions.map(p => p._id));
        } else {
            // Add specific permissions
            for (const perm of roleData.permissions) {
                const { resource, actions } = perm;
                actions.forEach(action => {
                    const permId = permissionMap[`${resource}:${action}`];
                    if (permId) rolePermissions.push(permId);
                });
            }
        }

        // Create or update role
        await Role.findOneAndUpdate(
            { name: roleName },
            {
                name: roleName,
                description: roleData.description,
                permissions: rolePermissions,
                isSystem: roleData.isSystem || false,
                meta: roleData.meta
            },
            { upsert: true }
        );
    }
}

/**
 * Initialize the RBAC system
 */
async function initializeRBAC() {
    try {
        console.log('Initializing RBAC system...');
        
        // Initialize permissions first
        const permissions = await initializePermissions();
        console.log(`Created/updated ${permissions.length} permissions`);

        // Then initialize roles with those permissions
        await initializeRoles(permissions);
        console.log(`Created/updated ${Object.keys(DEFAULT_ROLES).length} roles`);

        // Clear permission cache
        clearPermissionCache();

        console.log('RBAC system initialized successfully');
    } catch (error) {
        console.error('Error initializing RBAC system:', error);
        throw error;
    }
}

module.exports = {
    initializeRBAC,
    DEFAULT_ROLES,
    DEFAULT_PERMISSIONS
};