import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

const SearchBox = ({ history }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    console.log('key', keyword);
    if (keyword.trim()) {
        navigate(`/search/${keyword}`)
    } else {
        navigate('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} >
      <Form.Control style={{display : 'inline-flex', width : '350px'}}
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button style={{marginLeft : '10px'}} type='submit' variant='outline-success' className='py-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox