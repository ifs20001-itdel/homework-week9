module.exports = {
    errorHandler: (err, req, res, next) => {
        if (err) {
            switch (err.name) {
                case "SignInError":
                    res.status(401).json({ status: 401, message: 'Authentication failed: Invalid username/password' });
                    break;
                case "Unauthorized":
                    res.status(401).json({ status: 401, message: 'Authorization failed: You do not have access' });
                    break;
                default:
                    res.status(500).json({ status: 500, message: "Internal Server Error" });
            }
        }
    }
}
