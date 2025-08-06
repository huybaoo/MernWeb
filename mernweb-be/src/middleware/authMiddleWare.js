const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user){
        if (err){
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        if ( user?.isAdmin ){
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    }
    )
}

const authUserMiddleWare = (req, res, next) => {
    try {
        const token = req.headers.token.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(401).json({
                    message: 'Invalid token',
                    status: 'ERROR'
                });
            }

            req.user = user;
            next();
        });
    } catch (e) {
        return res.status(401).json({
            message: 'Authentication failed',
            status: 'ERROR'
        });
    }
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare
}