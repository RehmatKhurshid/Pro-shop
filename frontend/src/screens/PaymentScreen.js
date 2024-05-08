import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Button, Col} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import FormConatiner from '../Components/FormConatiner'
import { savePaymentMethod} from '../actions/cartActions'
import CheckoutSteps from '../Components/CheckoutSteps'

const PaymentScreen = () => {

    const cartInfo = useSelector((state) => state.cart)
    const { shippingAddress } = cartInfo

    const navigate = useNavigate();

    if(!shippingAddress){
        navigate('/shipping')
    }

    const [paymentMethod , setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')

    }


  return (
    <FormConatiner>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler} >
            <Form.Group>
                <Form.Label>Select Method</Form.Label>
                <Col>
                <Form.Check
                type='radio'
                label='PayPal or Credit Card'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
                >
                </Form.Check>
                <Form.Check
                type='radio'
                label='Stripe'
                id='Stripe'
                name='paymentMethod'
                value='Stripe'
                onChange={(e) => setPaymentMethod(e.target.value)}
                >
                </Form.Check>
                </Col>
            </Form.Group>

            <Button className='mt-3' type='submit' variant='primary' >Continue</Button>
        </Form>
    </FormConatiner>
  )
}

export default PaymentScreen