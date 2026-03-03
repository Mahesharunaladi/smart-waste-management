const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized to access this route' 
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get admin from token
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Admin not found' 
                });
            }

            if (!req.admin.isActive) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Account is deactivated' 
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized to access this route' 
            });
        }
    } catch (error) {
        next(error);
    }
};

// Check admin permissions
exports.authorize = (...permissions) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized' 
            });
        }

        // Super admin has all permissions
        if (req.admin.role === 'super_admin' || req.admin.permissions.includes('all')) {
            return next();
        }

        // Check if admin has required permission
        const hasPermission = permissions.some(permission => 
            req.admin.permissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ 
                success: false, 
                message: 'Insufficient permissions' 
            });
        }

        next();
    };
};
