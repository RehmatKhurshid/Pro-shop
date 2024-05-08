import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()

const generateToken = (id) => {
   console.log(' process.env.JWT_SECRET',  process.env.JWT_SECRET)
   return jwt.sign({id}, "my-secret", {
    expiresIn: '30d'
   })
}
export default generateToken