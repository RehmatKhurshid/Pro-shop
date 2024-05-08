import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Table, Button} from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Loader from '../Components/Loader'
import Messages from '../Components/Messages'
import { getUsers, deletedUser } from '../actions/userAction'
import { LinkContainer } from 'react-router-bootstrap'

const UserListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userList = useSelector((state) => state.userList);
    const {loading, error, users } = userList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const deleteUser = useSelector((state) => state.deleteUser);
    const { success : successDelete} = deleteUser;

    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            dispatch(getUsers())
        } else {
            navigate('/login')
        }
    }, [dispatch, userInfo, navigate, successDelete])

    const deleteHandler = (userId) => {
        if(window.confirm('Are you sure?')){
            dispatch(deletedUser(userId));
        }
    }
  return (
    <>
      <h1>Users</h1>
      {loading ? (<Loader /> ) : error ? (<Messages variant='danger'>{error}</Messages>) : (
        <Table striped responsive bordered hover className='table-sm' >
           <thead>
            <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
            </tr>
           </thead>
           <tbody>
            {users.map((user) => (
                <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>
                        {user.isAdmin ? (
                            <i className='fas fa-check' style={{color : 'green'}}></i> ) : (
                            <i className='fas fa-times' style={{color : 'red'}}></i>
                            )
                        }
                    </td>
                    <td>
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                            <Button variant='light' className='btn-sm'>
                            <i className='fas fa-edit'></i>
                            </Button>
                        </LinkContainer>
                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
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

export default UserListScreen