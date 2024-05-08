import asyncHandler from 'express-async-handler'

import Product from '../models/productModel.js'

const getProducts = asyncHandler( async (req, res) => {
    const keyword = req.query.keyword ? {
        name : {
            $regex : req.query.keyword,
            $options: 'i'
        },
    }
    : {}

    const products = await Product.find({...keyword})
    res.json(products)
});

const getProductById = asyncHandler( async (req, res) => {
    const product = await Product.findById({_id: req.params.id})
    if(product){
        res.json(product);
    }else{
        res.status(404).json({message: "product not found"})
    }

});

const deleteProduct = asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id)
    if(deletedProduct){
        res.json({message : 'product deleted successfully'});
    } else{
        res.status(404).json({message : 'product not found'});
    }
})

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name : 'sample Product',
        price : 0,
        user : req.user._id,
        image : '/images/sample.jpg',
        brand : 'sample brand',
        category : 'sample category',
        countInStock : 0,
        numReviews : 0,
        description : 'sample description'
    })

    const createdProduct = await product.save();
     res.status(201).json(createdProduct);
});

const updatedProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;

    const product = await Product.findById(req.params.id)

    if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save();
        res.json(updatedProduct)
    }else {
        res.status(404)
        throw new Error('product not found')
    }

});

const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if(product) {
        const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
        )

        if(alreadyReviewed){
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name : req.user.name,
            rating : Number(rating),
            comment,
            user : req.user._id
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length;

        product.rating = 
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
       const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);  
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})
export {getProducts, getProductById, deleteProduct, createProduct, updatedProduct, createProductReview}
