import express from 'express';
const router = express.Router();

import {
    authUser, deleteUser,
    getUserById, getUserProfile,
    getUsers, registerUser,
    updateToAdmin, updateUser,
    updateUserProfile
} from '../controllers/userController.js'

import { isAdmin, protect } from '../middleware/authMiddleware.js';

router.post('/login', authUser);

router.get('/', protect, isAdmin, getUsers);

router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUserProfile);

router.post('/', registerUser);

router.delete('/:id', protect, isAdmin, deleteUser);

router.get('/:id', protect, isAdmin, getUserById);

router.put('/:id', protect, isAdmin, updateUser);

router.put('/update/:id', protect, updateToAdmin)


export default router