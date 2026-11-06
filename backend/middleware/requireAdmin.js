
function requireAdmin(req, res, next) {
    if (!req.session || !req.session.adminId) {
        return res.status(401).json({
            message: "Admin login required."
        });
    }

    next();
}

module.exports = requireAdmin;
