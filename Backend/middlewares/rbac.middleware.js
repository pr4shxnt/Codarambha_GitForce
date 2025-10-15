const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const User = require('../models/user.model');

/**
 * Cache for role permissions to reduce DB queries
 * Format: { roleId: { resource: { action: boolean } } }
 */
const permissionCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Clear permission cache for a role
 */
function clearRoleCache(roleId) {
    permissionCache.delete(roleId.toString());
}

/**
 * Get cached permissions for a role
 */
async function getRolePermissions(roleId) {
    const cachedData = permissionCache.get(roleId.toString());
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
        return cachedData.permissions;
    }

    // Cache miss - load from DB
    const role = await Role.findById(roleId).populate('permissions');
    if (!role) return null;

    const permissions = {};
    role.permissions.forEach(perm => {
        permissions[perm.resource] = permissions[perm.resource] || {};
        permissions[perm.resource][perm.action] = true;
    });

    // Cache the results
    permissionCache.set(roleId.toString(), {
        timestamp: Date.now(),
        permissions
    });

    return permissions;
}

/**
 * Check if user has required permission
 */
async function hasPermission(user, resource, action) {
    // Admin role bypass
    if (user.roles.some(role => role.name === 'admin')) {
        return true;
    }

    // Check user's direct permissions first
    if (user.permissions?.some(p => p.resource === resource && p.action === action)) {
        return true;
    }

    // Check role-based permissions
    for (const roleId of user.roles) {
        const rolePerms = await getRolePermissions(roleId);
        if (rolePerms?.[resource]?.[action]) {
            return true;
        }
    }

    return false;
}

/**
 * RBAC middleware factory
 */
function rbac(resource, action) {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // Populate user roles if not already populated
            const user = await User.findById(req.user._id)
                .populate('roles')
                .populate('permissions');

            if (!user || !user.active) {
                return res.status(403).json({ message: 'User account is inactive' });
            }

            // Check for required permission
            const hasAccess = await hasPermission(user, resource, action);
            if (!hasAccess) {
                return res.status(403).json({ 
                    message: 'Access denied',
                    required: { resource, action }
                });
            }

            // Add role checking helpers to req
            req.userCan = async (res, act) => hasPermission(user, res, act);
            req.userIs = (roleName) => user.roles.some(r => r.name === roleName);

            next();
        } catch (error) {
            console.error('RBAC middleware error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

/**
 * Clear role cache when permissions are updated
 */
function clearPermissionCache() {
    permissionCache.clear();
}

module.exports = {
    rbac,
    hasPermission,
    clearPermissionCache,
    clearRoleCache
};