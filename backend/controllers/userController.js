import express from 'express';
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'

const authUser = asyncHandler(async (req, res) => {
    // console.log('here', req.body)
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log('user', user);
    console.log(await user.matchPassword(password))
    if (user && await user.matchPassword(password)) {
        console.log('inside if')
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)

        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password');
    }
})

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('email already exists')
    }

    const user = await User.create({
        name,
        email,
        password,
        isAdmin
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })

    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('user not found');
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save();
        if (updatedUser) {
            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id)
            })
        }

    } else {
        res.status(404)
        throw new Error('user not found');
    }
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndRemove(req.params.id)
    if (deletedUser) {
        res.json('deleted user successfully')
    } else {
        res.status(401)
        throw new Error('user not found')
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})


const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();

        if (updatedUser) {
            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            })
        }

    } else {
        res.status(404)
        throw new Error('user not found');
    }
})








const updateToAdmin = asyncHandler(async (req, res) => {
    try {
        console.log('In update to admin');
        const user = await User.findById(req.params.id);
        console.log('After finding user in update to admin');

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdminRequest = req.body.isAdminRequest;

            const updatedUserToAdmin = await user.save();
            console.log('After saving user in update to admin');

            res.json({
                id: updatedUserToAdmin._id,
                name: updatedUserToAdmin.name,
                email: updatedUserToAdmin.email,
                isAdmin: updatedUserToAdmin.isAdmin,
                isAdminRequest: updatedUserToAdmin.isAdminRequest,
            });
            console.log('update request sent')
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    updateToAdmin
}