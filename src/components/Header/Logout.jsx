import React from 'react'
import authService from '../../appwrite/auth'
function Logout() {
  const logoutHandler=()=>
    {
authService.logout();
  }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default Logout
