import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Col, Row, Button} from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Loader from '../Components/Loader'
import Messages from '../Components/Messages'
import { register } from '../actions/userAction'
import FormConatiner from '../Components/FormConatiner'


const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('')

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const userRegister = useSelector((state) => state.userRegister);
    const {loading, error, userInfo} = userRegister;
    const redirect = location.search ? location.search.split('=')[1] : '/';
    useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }
    }, [userInfo, navigate, redirect])
    
    const registerHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
           setMessage('Password do not match')
        }else{
            dispatch(register(name, email, password))
        }

    }

  return (
    <FormConatiner>
        <h1>Sign Up</h1>
        {message && <Messages variant='danger'>{message}</Messages>}
        {error && <Messages variant='danger'>{error}</Messages>}
        {loading && <Loader />}

        <Form onSubmit={registerHandler}>
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
            <Button style={{marginTop: '20px'}} type='submit' variant='primary'>Sign Up</Button>
        </Form>
         <Row className='py-3'>
            <Col>
              Already registered? { ' ' }
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
            </Col>
         </Row>
    </FormConatiner>
  )
}

export default RegisterScreen