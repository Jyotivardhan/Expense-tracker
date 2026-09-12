import jwt from 'jsonwebtoken';

export const protect = (req, res, next) =>{
    const header = req.headers.authorization;

    if(!header || !header.startsWith('Bearer')){
        return res.status(401).json({error : 'Not authenticated'})
    }

    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.Jwt_SECRET);
        req.userId = payload.id;
        next();
    } catch (err) {
        return res.status(401).json({err : "Invalid or expired token"})
    }
}