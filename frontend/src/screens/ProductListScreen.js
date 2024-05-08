import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import Loader from '../Components/Loader'
import Messages from '../Components/Messages'
import { listProduct, deleteProduct, createProduct } from '../actions/productAction'
import { LinkContainer } from 'react-router-bootstrap'
import { PRODUCT_CREATE_RESET } from '../constants/productConstant'

const ProductListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productDelete = useSelector((state) => state.productDelete);
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete;

    const productCreate = useSelector((state) => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate


    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`)
        } else {
            dispatch(listProduct())
        }
    }, [dispatch, userInfo, navigate, successDelete, successCreate, createdProduct])

    const deleteHandler = (id) => {
        console.log(id);
        if (window.confirm('Are you sure')) {
            dispatch(deleteProduct(id));
        }
    }
    const createProductHandler = () => {
        dispatch(createProduct());
    }


    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='float-end'>
                    <Button className='my-3 float-end' onClick={createProductHandler}>
                        <i className='fas fa-plus'>Create Product</i>
                    </Button>
                </Col>
            </Row>
            
            {loadingDelete && <Loader />}
            {errorDelete && <Messages variant='danger'>{errorDelete}</Messages>}
            {loading ? (<Loader />) : error ? (<Messages variant='danger'>{error}</Messages>) : (
                <Table striped responsive bordered hover className='table-sm' >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    {/* <LinkContainer to={`/admin/product/₹{product._id}/edit`}> */}

                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default ProductListScreen