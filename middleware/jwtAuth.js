const JWT = require('jsonwebtoken')

const jwtAuth = (req, res, next) => {
    const token = (req.cookies && req.cookies.token) || null;

    // if token does not exist
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token'
        })
    }

    // if token is exist
    try {
        const payload = JWT.verify(token, process.env.SECRET)
        req.user = { id : payload.id, email : payload.email };
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }


    next();    // It is used for change the process from one to two and so on
}

module.exports = jwtAuth