const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

exports.authenticateSocket = (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) return next(new Error('Authentication error'));

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = verified;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
};

exports.authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};
