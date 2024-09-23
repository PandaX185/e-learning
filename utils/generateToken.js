import jwt from 'jsonwebtoken'
export default async (payload)=>{
    const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
    return token;
}