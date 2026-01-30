import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) =>{

    //Authorization header
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(400).json({
            ok: false,
            message: "Unauthorized: token missing",
        });
    }
    
    //Extract token
    const token = authHeader.split(" ")[1];

    try{
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user info to request
        req.user = decoded;
        next();
    } catch(error){
        return res.status(401).json({
            ok: false,
            message: "Unauthorized: invalid or expired token",
        });
    }
};

export {authMiddleware};