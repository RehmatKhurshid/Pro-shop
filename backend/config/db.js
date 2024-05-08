import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/store', { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
        console.log("mongoose connected successfully");
    } catch (error) {
        console.log(`error while connecting db ${error.message}`);
        process.exit(1)
    }
}

export default connectDB