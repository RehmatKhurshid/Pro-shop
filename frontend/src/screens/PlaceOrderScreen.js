import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { createdOrder } from '../actions/orderAction'
import Messages from '../Components/Messages'
import CheckoutSteps from '../Components/CheckoutSteps'

const PlaceOrderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart)

    const orderCreate = useSelector((state) => state.orderCreate)
    const { loading, success, error, order } = orderCreate;

    //calculate price
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))

    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)

    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)
    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`)
        }
    }, [navigate, success])
    const placeOrderHandler = () => {
        dispatch(
            createdOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            })
        )

    }
    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address :</strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}
                                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </p>

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method : </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? (<Messages>Your caet is empty</Messages>) :
                                (
                                    <ListGroup variant='flush' >
                                        {cart.cartItems.map((item, index) => (
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
                                                        {/* {item.qty} x ${item.price} = {item.qty * item.price} */}
                                                        {item.qty} x ₹{item.price} = ₹{item.qty * item.price}

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
                                    {/* <Col>${cart.itemsPrice}</Col> */}
                                    <Col>₹{cart.itemsPrice}</Col>

                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    {/* <Col>${cart.shippingPrice}</Col> */}
                                    <Col>₹{cart.shippingPrice}</Col>

                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    {/* <Col>${cart.taxPrice}</Col> */}
                                    <Col>₹{cart.taxPrice}</Col>

                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    {/* <Col>${cart.totalPrice}</Col> */}
                                    <Col>₹{cart.totalPrice}</Col>

                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <div className="d-grid gap-2">
                                    <Button className='btn-block' type='button'
                                        disabled={cart.cartItems.length === 0}
                                        onClick={placeOrderHandler}
                                    >Place Order</Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen