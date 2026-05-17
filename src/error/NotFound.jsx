import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <div className='notfound'>
      <div className='box'>
        <h1>404 Not Found</h1>

        <p>Your visited page not found. You may go home page.</p><br /><br />

        <div className="button">
          <Link to={'/'}><button>Back to home page</button></Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound