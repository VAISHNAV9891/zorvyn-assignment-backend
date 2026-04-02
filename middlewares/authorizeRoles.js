export const isValidUser = (allowedRoles) => {
    
    return (req, res, next) => {
        
        if (!req.user || !req.user.role) {
            return res.status(401).json({message : "Unauthorized access: User information not found."});
        }      
        if (!allowedRoles.includes(req.user.role)) { 
            return res.status(403).json({ message : `Access Denied: Only ${allowedRoles.join(' or ')} can perform this action.`});
        } 
        next();
    };
};