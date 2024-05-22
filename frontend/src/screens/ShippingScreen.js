import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import FormConatiner from '../Components/FormConatiner'
import { saveShippingAddress} from '../actions/cartActions'
import CheckoutSteps from '../Components/CheckoutSteps'

const ShippingScreen = () => {

    const cartInfo = useSelector((state) => state.cart)

    const {shippingAddress} = cartInfo;

    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress.address);
    const [city , setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        console
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        navigate('/payment')
    }
  return (
    <FormConatiner>
        <CheckoutSteps step1 step2 />
        <h1>Shipping Address</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='address'>
               <Form.Label>Address</Form.Label>
               <Form.Control
                type='text'
                placeholder='Enter Address'
                value={address}
                required
                onChange={(e) =>setAddress(e.target.value)}
               >
               </Form.Control>
            </Form.Group>

            <Form.Group controlId='address'>
               <Form.Label>City</Form.Label>
               <Form.Control
                type='text'
                placeholder='Enter city'
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
               >
               </Form.Control>
            </Form.Group>

            <Form.Group controlId='postalCode'>
               <Form.Label>postal code</Form.Label>
               <Form.Control
                type='text'
                placeholder='Enter postal code'
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
               >
               </Form.Control>
            </Form.Group>

            <Form.Group controlId='postalCode'>
               <Form.Label>Country</Form.Label>
               <Form.Control
                type='text'
                placeholder='Enter country'
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
               >
               </Form.Control>
            </Form.Group>

            <Button style={{marginTop: '20px'}} type='submit' variant='primary'>
                Countinue
            </Button>
        </Form>
    </FormConatiner>
  )
}

export default ShippingScreen