import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../../../appwrite/auth';
import { login } from '../../../ticketStore/authSlice';
import Logout from '../../Header/Logout';
import { user } from '@nextui-org/react';

import authSlice, { logout } from '../../../ticketStore/authSlice';

function Header() {
  const dispatch=useDispatch()
  const status = useSelector(state => state.auth.status);

  const a = useSelector(state => state.auth.userData);
  const [userTypeInfo, setUserTypeInfo] = useState(null);

  const [statusLog, setStatusLog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    console.log("status is",status);
    
    if(status){
    
    if (a !== null) {

      if (a.userType.total > 0) {
        const userType = a.userType.documents[0].type;
        setUserTypeInfo(userType)
      }
  
    }
  }
  else setUserTypeInfo(null)


  }, [status,statusLog])

  useEffect(() => {

    (async function () {
      try {
        const userData = await authService.getCurrentUser();
        

        if (userData){ 
        
          setStatusLog(true)}
        else {
          setUserTypeInfo(null)
          setStatusLog(false)
        }
        if(!userData) dispatch(logout());
      } catch (e) {
        console.log("not login anyone")
      }

    })();
    console.log("statis log is",statusLog)
  }, [statusLog,status])




  // Toggle menu for mobile view
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-blue-50 shadow-md fixed w-full z-[2000] top-0">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        <div className='flex'>
          <img src='../logo1.png' className='w-10 h-10 mr-1' />
          <h1 className="text-2xl font-bold text-gray-800">Navigate The City</h1>
        </div>

        {/* Hamburger Menu for Small Screens */}
        <div className="lg:hidden">
          {/* Replace MenuIcon */}
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>

        </div>

        {/* Nav Links */}
        <nav
          className={`${menuOpen ? 'block' : 'hidden'
            } flex lg:flex items-center flex-col lg:flex-row lg:space-x-6 w-full lg:w-auto lg:bg-transparent lg:static absolute bg-blue-50 top-full left-0 lg:mt-0 mt-[2px] lg:py-0 py-6 px-6 lg:px-0`}>


          {userTypeInfo !== "company" && <>
            <Link to='/home' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 hover:scale-[1.2] duration-200">
              Home
            </Link>
            <Link to='/map' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Map
            </Link>
            <Link to='/route' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Route
            </Link>
            <Link to='/contact' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Contact
            </Link>
        {userTypeInfo=="driver"  &&  <Link to='/msg' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Message
            </Link>}
          </>
          }
          {userTypeInfo == "company" && <>
            <Link to='/dashboard' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 hover:scale-[1.2] duration-200">
              Home
            </Link>
            <Link to='/map' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Map
            </Link>
            <Link to='/route' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Route
            </Link>
            <Link to='/manageroutes' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Manage Route
            </Link>
            <Link to='/managebus' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Manage Bus
            </Link>
            <Link to='/ticketmessage' className="block lg:inline-block text-gray-800 font-semibold hover:text-blue-600 mt-4 lg:mt-0 hover:scale-[1.2] duration-200">
              Ticket Notification
            </Link>
          </>
          }

          <div className='mt-4 lg:mt-0'>
            {(!status && !statusLog) && (
              <Link to='/loginpage' className="block lg:inline-block duration-200 hover:scale-[0.9]">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
                  Sign In
                </span>
              </Link>
            )}

            {(status || statusLog) && <Logout />}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
