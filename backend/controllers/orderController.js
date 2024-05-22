import asyncHandler from 'express-async-handler'

import Order from '../models/orderModel.js'

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    console.log('req.body', req.body);
    console.log('req.user._id', req.user)

    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order found')
        return
    } else {
        let order = new Order({
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user : req.user._id,  
        });
        let createdOrder = await order.save();
        res.status(201).json(createdOrder)
    }
})

const getOrderById = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(order){
        res.json(order)
    }else{
        res.status(404)
        throw new Error('Order not find');
    }
})

const updateOrderToPaid = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id);
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status : req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder)
    } else {
        res.status(404);
        throw new Error('Order Not found')
    }

})

const updateOrderToDeliver = asyncHandler(async (req, res) => {
     const order = await Order.findById(req.params.id)

     if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save();
        res.json(updatedOrder)
     } else {
        res.status(404)
        throw new Error('Order Not found')
     }
})

const getMyOrders = asyncHandler(async (req, res) => {
    const myOrders = await Order.find({user : req.user._id});
    res.json(myOrders);
})

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
})

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDeliver }