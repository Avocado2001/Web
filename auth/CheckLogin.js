const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    let authorization = req.header('Authorization');
    if (!authorization) {
        return res.status(401).json({
            code: 101,
            message: 'Token is required to access this resource'
        });
    }
    let token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            code: 101,
            message: 'Token is invalid'
        });
    }

    const { JWT_SECRET } = process.env;
    if (!token) {
        return res.status(401).json({
            code: 101,
            message: 'Token is required'
        });
    }
    jwt.verify(token, JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({
                code: 101,
                message: 'Token is invalid'
            });
        }
        req.user = data;
        next();
    })
}