const jwt = require('jsonwebtoken');
const CS_SECRET_KEY = process.env.JWT_SECRET || 'development-only-secret';

const generateToken=(payload)=>{
    const token=jwt.sign(payload,CS_SECRET_KEY,{expiresIn:'24h'});
    return token;
}

const verifyToken=(token)=>{
    const decoded=jwt.verify(token, CS_SECRET_KEY);
    return decoded;
}    

module.exports={generateToken,verifyToken};
