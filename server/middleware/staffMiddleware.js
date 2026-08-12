const staffOnly = (req, res, next) => {
    if (req.user.role !== "staff") {
        return res.status(403).json({
            message: "Staff access required"
        });
    }

    next();
};

module.exports = staffOnly;