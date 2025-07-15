// Role-based middleware
const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: `Access denied. ${role} role required.` });
        }
    };
};

module.exports = requireRole;