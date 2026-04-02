import jwt from 'jsonwebtoken';

export const tokenVerifier = (req,res,next) => {
try {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({ message : 'Access Denied: No token provided.' });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = decoded;

    if(req.user.status !== 'active') return res.status(400).json({ message : 'Access Denied: Account is inactive.' });

    next();//Take the program counter to the next function (i.e. controller) in the sequence
} catch(error){
   return res.status(401).json({ message : 'Access Denied: Invalid token.' });
}
}
