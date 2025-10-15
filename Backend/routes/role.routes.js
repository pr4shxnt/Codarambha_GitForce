const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { rbac } = require('../middlewares/rbac.middleware');

// Role management routes (protected by RBAC)
router.get('/roles', 
    rbac('roles', 'read'),
    roleController.listRoles
);

router.get('/roles/:roleId', 
    rbac('roles', 'read'),
    roleController.getRole
);

router.post('/roles', 
    rbac('roles', 'create'),
    roleController.createRole
);

router.put('/roles/:roleId', 
    rbac('roles', 'update'),
    roleController.updateRole
);

router.delete('/roles/:roleId', 
    rbac('roles', 'delete'),
    roleController.deleteRole
);

module.exports = router;