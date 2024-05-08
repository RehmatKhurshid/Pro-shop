import React from 'react'
import {Row, Col, Container} from 'react-bootstrap'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import Product from '../Components/Product'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect } from 'react'
import {listProduct} from '../actions/productAction'
import Loader from '../Components/Loader'
import Messages from '../Components/Messages'


const HomeScreen = () => {
  const params = useParams();
  const keyword = params.keyword
   
  const dispatch = useDispatch()

  const productList = useSelector(state => state.productList)
  const {loading, error, products} = productList
   
  useEffect(() => {
     dispatch(listProduct(keyword))
  }, [dispatch, keyword]);

  return (
    <> 
    <h3>Latest Products</h3> 
    {loading ? <Loader>loading</Loader> : error ? <Messages variant={'danger'}>{error}</Messages>: 
         <Row>
         {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product}/>
          </Col>
         ))}
       </Row>
    } 

    </>
  )
}

export default HomeScreen