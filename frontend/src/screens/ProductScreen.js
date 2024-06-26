import React from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {useState, useEffect} from 'react'
import Rating from '../Components/Rating'
import {detailsProduct, createProductReview} from '../actions/productAction'
import Loader from '../Components/Loader'
import Messages from '../Components/Messages'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstant'

const ProductScreen = ({match}) => {
    const params = useParams();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const {loading, error, product} = productDetails

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

   const productReviewCreate = useSelector(state => state.productReviewCreate);
   const { loading : loadingProductReview, success : successProductReview, error : errorProductReview } = productReviewCreate 


    useEffect(() => {
      if(successProductReview) {
        setRating(0);
        setComment('')
      }
       if(!product._id || product._id !== params.id){
        dispatch(detailsProduct(params.id))
        dispatch({ type : PRODUCT_CREATE_REVIEW_RESET})
       }
    }, [dispatch, successProductReview,qty, params.id, product])

    const addToCartHandler = () => {
         navigate(`/cart/${params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(params.id, {rating, comment}))
    }
  return (
    <>
      <Link className='btn btn-dark ' style={{marginBottom:"10px"}} to={'/'}>
        Go Back
      </Link>
      {loading ? <Loader>loading</Loader> : error ? <Messages variant={'danger'}>{error}</Messages>:   
           <>
            <Row>
             <Col md={6}>
             <Image src={product.image} alt={product.name} fluid />
             </Col>
           
             <Col md={3}>
             <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </ListGroup.Item>
                    {/* <ListGroup.Item>Price: ${product.price}</ListGroup.Item> */}
                    <ListGroup.Item>Price: ₹{product.price}</ListGroup.Item>

                    <ListGroup.Item>
                      Description: {product.description}
                    </ListGroup.Item>
                </ListGroup>
             </Col>
          
             <Col md={3}>
                <Card>
                 <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                              Price:
                            </Col>
                            <Col>
                            {/* <strong>$ {product.price}</strong> */}
                            <strong>₹ {product.price}</strong>

                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                              Status:
                            </Col>
                            <Col>
                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock' }
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                    <ListGroup.Item>
                    <div className="d-grid gap-2">
                        <Button className='btn-block' type='button' onClick={addToCartHandler} disabled={product.countInStock===0}>Add To Cart</Button>
                    </div>
                    </ListGroup.Item>
                 </ListGroup>
                </Card>
             </Col>
           </Row>

            <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Messages>No Reviews</Messages>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {successProductReview && (
                    <Messages variant='success'>
                      Review submitted successfully
                    </Messages>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Messages variant='danger'>{errorProductReview}</Messages>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        style={{marginTop : '20px'}}
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Messages>
                      Please <Link to='/login'>sign in</Link> to write a review{' '}
                    </Messages>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            </Row>
            
            </>
      
      }

    </>
  )
}

export default ProductScreen