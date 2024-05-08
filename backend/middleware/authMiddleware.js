import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; 

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
        token = req.headers.authorization.split(' ')[1];
        let decoded  = jwt.verify(token, "my-secret")
        req.user = await User.findById(decoded.id).select('-password');
        next()
    } catch (error) {
        res.status(401);
        throw new Error('not authorized, token failed')

    
    }
  } 
  if(!token){
    res.status(401);
    throw new Error('not authorized, no token')
  }

})

const isAdmin = asyncHandler(async (req, res, next) => {
   if(req.user && req.user.isAdmin){
    next();
   } else {
   res.status(401);
   throw new Error('not authorized, not an admin')
   }
})

export {protect, isAdmin};