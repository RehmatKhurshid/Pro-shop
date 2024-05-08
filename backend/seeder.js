import mongoose from 'mongoose';
import users from './users.js';
import products from './products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

import connectDB from './config/db.js';

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

      const createdUser = await User.insertMany(users);
      const adminUser = createdUser[0]._id

      const sampleProduct = products.map(product => {
        return {...product, user: adminUser}
      })
      await Product.insertMany(sampleProduct);
      console.log('data imported');
      process.exit()
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

      console.log('data destroyed');
      process.exit()
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

if(process.argv[2] === '-d'){
    destroyData()
}else{
    importData()
}