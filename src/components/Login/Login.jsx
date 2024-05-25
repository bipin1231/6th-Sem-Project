import React, { useState } from 'react'

import { Link, NavLink, useNavigate } from 'react-router-dom'


import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/date-picker";



import { Button, ButtonGroup } from "@nextui-org/react";

import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux'

import { Input } from "@nextui-org/input";

import authService from "../../appwrite/auth";
import { login as authLogin } from '../../ticketStore/authSlice';

import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Login() {

  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");




  const navigate = useNavigate();



  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);

    //navigate('/selectbus',{state:{...data}});

    try {

      const session = await authService.login(data)
      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) {
          dispatch(authLogin(userData));
          navigate("/")
          console.log(userData);
        }
      }
    } catch (error) {
      console.log(error);
    }



  };

  const googleAuth = () => {
 
    authService.googleLogin()


 
    }
  
  // useGoogleLogin({
  //   onSuccess:(takeResponse)=>{console.log(takeResponse);
  //     authService.googleLogin()
  //   }


  return (

    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full flex mt-10 justify-center h-96'>
          <Card className='w-[40%] '>
            <CardBody>
              <div className='flex justify-center'>
                <div className='flex flex-col gap-7 w-[60%]'>

                  <Input
                    variant='underlined'
                    color='black'
                    type="email" label="Email"
                    {...register("email", { required: true })}
                  />
                  <Input
                    variant='underlined'
                    color='black'
                    type="password" label="Password"
                    {...register("password", { required: true })}

                  />




                  <Button type='submit' radius="full" className='w-full font-semibold text-lg'>
                    Login
                  </Button>
                  <div>

                    <Button
                      color=''
                      radius="full" className='w-full font-semibold text-lg'
                      onClick={googleAuth}
                    >
                      <img className='w-9 bg-transparent' src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png" alt="" />
                      <p> Sign in with Google</p>
                    </Button>
                 
                  </div>


                  {/* <GoogleLogin

                    onSuccess={credentialResponse => {
                      console.log(credentialResponse);
                      console.log(jwtDecode(credentialResponse.credential));

                      const userData = authService.googleLogin();
                      console.log(userData);
                    }}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />; */}
               
               <h1 className='text-center'>Dont have an account?
               <Link to={'/signup'}>
               <span className='text-blue-600 cursor-pointer ml-2'>Sign Up</span>  </Link></h1>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

      </form>

    </>
  )
}

export default Login
// =======
// //     <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-[1010]">
// //       <div className="bg-white rounded-lg p-8 shadow-lg">
// //         <form onSubmit={handleSubmit}>
// //           <div className="flex justify-between font-bold mb-3">
// //             <p>Login</p>

// //             <button
// //               type="button"
// //               className="bg-red-500 hover:bg-red-700 text-white px-2 rounded focus:outline-none focus:shadow-outline"
// //               onClick={onClose}
// //             >
// //               X
// //             </button>
// //           </div>
// //           <div className="mb-4">
// //             <label
// //               htmlFor="email"
// //               className="block text-gray-700 font-bold mb-2"
// //             >
// //               Email address
// //             </label>
// //             <input
// //               type="email"
// //               id="email"
// //               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //               placeholder="Enter email"
// //               // value={email}
// //               // onChange={(e) => setEmail(e.target.value)}
// //             />
// //           </div>

// //           <div className="mb-6">
// //             <label
// //               htmlFor="password"
// //               className="block text-gray-700 font-bold mb-2"
// //             >
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               id="password"
// //               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //               placeholder="Password"
// //               // value={password}
// //               // onChange={(e) => setPassword(e.target.value)}
// //             />
// //           </div>
// //           <button
// //             type="submit"
// //             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// //           >
// //             logIn
// //           </button>
// //           <div>
// //             <p>Don't have an Account?</p>
// //             <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign Up</button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;
// // >>>>>>> main
