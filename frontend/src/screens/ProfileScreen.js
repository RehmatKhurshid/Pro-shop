import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Col, Row, Button, Table} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
import Loader from '../Components/Loader'
import Messages from '../Components/Messages'
import { getUserDetails, updateUserProfile } from '../actions/userAction';
import { listMyOrders } from '../actions/orderAction'


const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const  userLogin  = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user, success } = userDetails;

    const orderListMy = useSelector((state) => state.orderListMy);
    const { loading : loadingOrders, error : errorOrders, orders } = orderListMy;

    useEffect(() => {
        if(!userInfo){
            navigate('/login')
        }else{        
        if(!user.name){
            dispatch(getUserDetails('profile'))
            dispatch(listMyOrders())
         }else {
            setName(user.name);
            setEmail(user.email)
         }
        }
    }, [dispatch, userInfo, navigate, user])
    
    const UpdateHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
           setMessage('Password do not match')
        }else{
            dispatch(updateUserProfile({id: user._id, name, email, password}))
        }

    }

  return (
    <Row>
        <Col md={3}>
        <h2>Profile</h2>
        {message && <Messages variant='danger'>{message}</Messages>}
        {error && <Messages variant='danger'>{error}</Messages>}
        {success && <Messages variant='success'>Profile Updated</Messages>}
        {loading && <Loader />}

        <Form onSubmit={UpdateHandler}>
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
            <Form.Group controlId='email'>
                <Form.Label>Enter Email</Form.Label>
                <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='password'>
                <Form.Label>Enter Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Enter Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Button style={{marginTop: '20px'}} type='submit' variant='primary'>Update </Button>
        </Form>
        </Col>
         <Col md={9}>
            <h2>My Orders</h2>
            {loadingOrders ? (<Loader />) : errorOrders ? (
                <Messages variant='danger' >{errorOrders}</Messages>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELEVIRED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>
                                    {order.isPaid ? (
                                        order.paidAt.substring(0, 10)
                                    ) : ( 
                                        <i className='fas fa-times' style={{color : 'red'}}></i>
                                    )}
                                </td>
                                <td>
                                {order.isDelivered ? (
                                        order.deliveredAt.substring(0, 10)
                                    ) : ( 
                                        <i className='fas fa-times' style={{color : 'red'}}></i>
                                )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button className='btn-sm' variant='light'>Details</Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            )}
         </Col>  
    </Row>
  )
}

export default ProfileScreen