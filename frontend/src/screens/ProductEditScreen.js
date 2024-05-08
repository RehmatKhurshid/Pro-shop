import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../Components/Loader'
import Messages from '../Components/Messages'
import FormConatiner from '../Components/FormConatiner'
import { detailsProduct, updateProduct} from '../actions/productAction'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstant'
import axios from 'axios'

const ProductEditScreen = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const productId = params.id

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description , setDescription] = useState('');
    const [uploading , setUploading] = useState(false);

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector((state) => state.productUpdate);
    const { loading : loadingUpdate, error : errorUpdate, success : successUpdate} = productUpdate

    useEffect(() => {
          if(successUpdate){
            dispatch({ type : PRODUCT_UPDATE_RESET })
            navigate('/admin/productlist')
          } else {
            if (!product.name || product._id !== productId) {
              // if (!product.name || product._id == productId) {

                dispatch(detailsProduct(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
        
      }, [dispatch,navigate, productId, product, successUpdate])
    
      const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)
    
        try {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
    
          const { data } = await axios.post('/api/upload', formData, config)
    
          setImage(data)
          setUploading(false)
        } catch (error) {
          console.error(error)
          setUploading(false)
        }
      } 
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id : productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        }))
    }

  return (
    <>
     <Link to='/admin/productlist' className='btn btn-dark my-3'> Back </Link>

    <FormConatiner>
        {loadingUpdate && (<Loader />)}
        {errorUpdate && <Messages variant='danger'>{errorUpdate}</Messages>}
        {/* <h1>Edit Product</h1> */}
        <h1>add/update Product</h1>

          {loading ? (<Loader />) : error ? (
            <Messages variant='danger'>{error}</Messages>
          ) : (
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
                <Form.Label>Enter Name</Form.Label>
                <Form.Control 
                type='text' 
                placeholder='Enter Name' 
                value={name}
                onChange={(e) => setName(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='price'>
                <Form.Label>Enter price</Form.Label>
                <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='file'>
                <Form.Label>Enter image</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter image'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                >
                </Form.Control>
                <Form.Control
                type='file'
                label='Choose File'
                name='image'
                onChange={uploadFileHandler}
                ></Form.Control>
                {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
                <Form.Label>Enter brand</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
           
            <Form.Group controlId='countInStock'>
                <Form.Label>Enter count in stock</Form.Label>
                <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
                <Form.Label>Enter category</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
                <Form.Label>Enter description</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Button style={{marginTop: '20px'}} type='submit' variant='primary'>add/Update Product  </Button>
        </Form>
        )}
    </FormConatiner>
    </>
  )
}

export default ProductEditScreen