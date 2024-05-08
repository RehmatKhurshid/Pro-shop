import React from 'react'
import axios from 'axios'
import {PayPalButton} from 'react-paypal-button-v2'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Card } from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import { getOrderDetails } from '../actions/orderAction'
import Messages from '../Components/Messages'
import Loader from '../Components/Loader'
import { payOrder, deliverOrder } from '../actions/orderAction'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstant'

const OrderScreen = () => {
    const dispatch = useDispatch();    
    const navigate = useNavigate();
    const params = useParams();
    const orderId = params.id;
    const [sdkReady, setSdkReady] = useState(false)

    const orderDetail = useSelector((state) => state.orderDetail)
    const { loading, error, order } = orderDetail;

    const orderPay = useSelector((state) => state.orderPay)
    const { loading : loadingPay, success : successPay } = orderPay;

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;

    const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading : loadingDeliver, error : errorDeliver, success : successDeliver} = orderDeliver

    if(!loading){
    //calculate price
    const addDecimals = (num) => {
        return (Math.round(num * 100)/100).toFixed(2)
    }
    order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    }


     useEffect(() => {
        if(!userInfo){
            navigate('/login')
        }
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
              setSdkReady(true)
            }
            document.body.appendChild(script)
          }

        if(!order || successPay || successDeliver || order._id !== orderId){
           console.log('hiii');
            dispatch({
                type : ORDER_PAY_RESET
            })
            dispatch({ type : ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid){
            if(!window.paypal){
                addPayPalScript()
            } else {
                setSdkReady(true)
            }

        }
     }, [dispatch, orderId, successPay, order, successDeliver])

     const successPaymentHandler = (paymentResult) => {
          dispatch(payOrder(orderId, paymentResult))
     }

     const deliverHandler = () => {
        dispatch(deliverOrder(order))
     }
  return loading ? (<Loader />) : error ? (<Messages variant='danger'>{error}</Messages>) : 
  (
    <>
     <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Order Details</h2>
                    <p>
                        <strong>Name : </strong> {order.user.name}
                    </p>
                    <p>
                        <strong>Email : </strong> {''}
                        <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                    </p>
                    <p>
                    <strong>Address :</strong>
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? (<Messages variant='success'>Delivered on {order.deliveredAt}</Messages>) : (
                        <Messages variant='danger'>Not delivered</Messages>
                    )}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                    <strong>Method : </strong>
                    {order.paymentMethod}
                    </p>
                    {order.isPaid ? (<Messages variant='success'>Paid on {order.paidAt}</Messages>) : (
                        <Messages variant='danger'>Not Payed</Messages>
                    )}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.length === 0 ? (<Messages>Your caet is empty</Messages>) : 
                    (
                        <ListGroup variant='flush' >
                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                   <Row>
                                    <Col md={1}>
                                        <Image src={item.image}
                                        alt={item.name}
                                        rounded
                                        fluid
                                        />
                                    </Col>
                                    <Col>
                                    <Link to={`/product/${item.product}`}>
                                        {item.name}
                                    </Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = {item.qty * item.price}
                                    </Col>
                                   </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
             <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>${order.itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping</Col>
                            <Col>${order.shippingPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>${order.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    {!order.isPaid && (
                        <ListGroup.Item>
                            {loadingPay ? (
                                <Loader />
                            ) :
                            (
                                <PayPalButton
                                amount={order.totalPrice}
                                onSuccess={successPaymentHandler} />
                            )
                        }
                        </ListGroup.Item>
                    )}

                    {loadingDeliver && <Loader />}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                            <Button type='button' className='btn btn-block'
                            onClick={deliverHandler}>
                                Mark as Delivered
                            </Button>
                        </ListGroup.Item>
                    )}
                </ListGroup>
             </Card>
            </Col>
        </Row>
    </>
  )
}

export default OrderScreen