const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const { clearPermissionCache, clearRoleCache } = require('../middlewares/rbac.middleware');

// List all roles
exports.listRoles = async (req, res) => {
    try {
        const roles = await Role.find({})
            .populate('permissions')
            .sort('name');
        
        res.json({ roles });
    } catch (error) {
        console.error('List roles error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get role details
exports.getRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId)
            .populate('permissions');
        
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.json({ role });
    } catch (error) {
        console.error('Get role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new role
exports.createRole = async (req, res) => {
    try {
        const { name, description, permissions, meta } = req.body;

        // Check for duplicate
        const existing = await Role.findOne({ name });
        if (existing) {
            return res.status(409).json({ message: 'Role already exists' });
        }

        // Validate permissions
        if (permissions) {
            const validPerms = await Permission.find({ _id: { $in: permissions }});
            if (validPerms.length !== permissions.length) {
                return res.status(400).json({ message: 'Invalid permissions' });
            }
        }

        const role = new Role({
            name,
            description,
            permissions,
            meta
        });

        await role.save();
        clearPermissionCache(); // Clear cache when roles change

        res.status(201).json({ role });
    } catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update role
exports.updateRole = async (req, res) => {
    try {
        const { name, description, permissions, meta } = req.body;
        const roleId = req.params.roleId;

        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Prevent modification of system roles
        if (role.isSystem) {
            return res.status(403).json({ message: 'System roles cannot be modified' });
        }

        // Check name uniqueness if changing
        if (name && name !== role.name) {
            const existing = await Role.findOne({ name });
            if (existing) {
                return res.status(409).json({ message: 'Role name already exists' });
            }
        }

        // Validate permissions if updating
        if (permissions) {
            const validPerms = await Permission.find({ _id: { $in: permissions }});
            if (validPerms.length !== permissions.length) {
                return res.status(400).json({ message: 'Invalid permissions' });
            }
        }

        // Update role
        Object.assign(role, {
            name: name || role.name,
            description: description || role.description,
            permissions: permissions || role.permissions,
            meta: meta ? { ...role.meta, ...meta } : role.meta
        });

        await role.save();
        clearRoleCache(roleId); // Clear specific role cache

        res.json({ role });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        if (role.isSystem) {
            return res.status(403).json({ message: 'System roles cannot be deleted' });
        }

        // Check if role is in use
        const User = require('../models/user.model');
        const usersWithRole = await User.countDocuments({ roles: role._id });
        if (usersWithRole > 0) {
            return res.status(400).json({ 
                message: 'Role is in use',
                usersCount: usersWithRole
            });
        }

        await role.deleteOne();
        clearRoleCache(req.params.roleId);

        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};