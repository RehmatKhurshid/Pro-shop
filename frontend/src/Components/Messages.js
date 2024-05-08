import React from 'react'
import { Alert } from 'react-bootstrap'

const Messages = ({variant, children}) => {
  return (
    <Alert variant={variant}>{children}</Alert>
  )
}

Messages.defaultProps = {
    variant : 'info'
}

export default Messages