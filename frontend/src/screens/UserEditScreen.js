import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../Components/Loader'
import Messages from '../Components/Messages'
import { getUserDetails, updateUser } from '../actions/userAction'
import FormConatiner from '../Components/FormConatiner'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const userId = params.id

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState('');

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user} = userDetails;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading : loadingUpdate, error : errorUpdate, success : successUpdate} = userUpdate;



    useEffect(() => {
        if(successUpdate){
            dispatch({ type : USER_UPDATE_RESET })
            navigate('/admin/userlist')
        } else {
            if(!user.name || user._id !== userId){
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }
    }, [dispatch, user, navigate, userId, successUpdate])
    
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({_id: userId, name, email, isAdmin}))
    }

  return (
    <>
     <Link to='/admin/userlist' className='btn btn-dark my-3'> Back </Link>

    <FormConatiner>
        <h1>Edit User</h1>
          {loadingUpdate && (<Loader />) }
          { errorUpdate && (<Messages variant='danger'>{errorUpdate}</Messages>)}
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
            <Form.Group controlId='isAdmin'>
                <Form.Check
                type='checkbox'
                placeholder='Enter password'
                label='is admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                >
                </Form.Check>
            </Form.Group>
           
            <Button style={{marginTop: '20px'}} type='submit' variant='primary'>Update User</Button>
        </Form>
        )}
    </FormConatiner>
    </>
  )
}

export default UserEditScreen