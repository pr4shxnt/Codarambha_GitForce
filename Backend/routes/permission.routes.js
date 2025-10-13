const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const { rbac } = require('../middlewares/rbac.middleware');

// Permission management routes (protected by RBAC)
router.get('/permissions', 
    rbac('permissions', 'read'),
    permissionController.listPermissions
);

router.get('/permissions/:permissionId', 
    rbac('permissions', 'read'),
    permissionController.getPermission
);

router.post('/permissions', 
    rbac('permissions', 'create'),
    permissionController.createPermission
);

router.put('/permissions/:permissionId', 
    rbac('permissions', 'update'),
    permissionController.updatePermission
);

router.delete('/permissions/:permissionId', 
    rbac('permissions', 'delete'),
    permissionController.deletePermission
);

module.exports = router;