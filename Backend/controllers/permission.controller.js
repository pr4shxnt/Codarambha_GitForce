const Permission = require('../models/permission.model');
const { clearPermissionCache } = require('../middlewares/rbac.middleware');

// List all permissions
exports.listPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find({})
            .sort({ resource: 1, action: 1 });
        
        res.json({ permissions });
    } catch (error) {
        console.error('List permissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get permission details
exports.getPermission = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.permissionId);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        res.json({ permission });
    } catch (error) {
        console.error('Get permission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new permission
exports.createPermission = async (req, res) => {
    try {
        const { name, description, resource, action } = req.body;

        // Check for duplicate
        const existing = await Permission.findOne({ resource, action });
        if (existing) {
            return res.status(409).json({ message: 'Permission already exists' });
        }

        const permission = new Permission({
            name,
            description,
            resource,
            action
        });

        await permission.save();
        clearPermissionCache(); // Clear cache when permissions change

        res.status(201).json({ permission });
    } catch (error) {
        console.error('Create permission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update permission
exports.updatePermission = async (req, res) => {
    try {
        const { name, description } = req.body;
        const permissionId = req.params.permissionId;

        const permission = await Permission.findById(permissionId);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        // Only allow updating name and description
        permission.name = name || permission.name;
        permission.description = description || permission.description;

        await permission.save();
        clearPermissionCache();

        res.json({ permission });
    } catch (error) {
        console.error('Update permission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete permission
exports.deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.permissionId);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        // Check if permission is used by any roles
        const Role = require('../models/role.model');
        const rolesWithPerm = await Role.countDocuments({ permissions: permission._id });
        if (rolesWithPerm > 0) {
            return res.status(400).json({ 
                message: 'Permission is in use by roles',
                rolesCount: rolesWithPerm
            });
        }

        await permission.deleteOne();
        clearPermissionCache();

        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Delete permission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};