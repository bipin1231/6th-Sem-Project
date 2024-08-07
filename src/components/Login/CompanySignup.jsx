import React, { useState } from 'react'

import { Link, NavLink, useNavigate } from 'react-router-dom'


import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/date-picker";



import { Button, ButtonGroup } from "@nextui-org/react";

import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux'

import { Input } from "@nextui-org/input";
import authService from '../../appwrite/auth';

function CompanySignup() {


const navigate=useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = async(data) => {
   

    console.log(errors);

    try {
      const userData = await authService.createCompanyAccount(data)
      if (userData) {
          const userData = await authService.getCurrentUser()
          authService.logout();
        console.log(userData);
        navigate('/login');
     
      }
  } catch (error) {
      console.log(error);
  }

  };


  





  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full flex justify-center gap-4'>
          <Card className='w-[90%] md:w-[40%] mt-10'>
            <CardBody>
              <div className='flex justify-center'>
                <div className='flex flex-col gap-5 w-[95%] md:w-[60%]'>
                  <Input
                    variant='underlined'
                    color='black'
                    type="text" label="Company Name"
                    {...register("name", {required: true })}
                  />
                  {console.log(errors)}
                  <Input
                    variant='underlined'
                    color='black'
                    type="email" label="Email"
                    {...register("email", {required: true })}
                  />
                  <Input
                    variant='underlined'
                    color='black'
                    type="password" label="Password"
                    {...register("password", {required: true,minLength:8 })}

                
                  //  onChange={(e) => setPassword(e.target.value)}
                  />

                  {/* <Input
                    variant='underlined'
                    color='black'
                    type="password" label="Confirm Password"
                    {...register("cpassword")}
               
                  /> */}
              
      
                  <Button type='submit' radius="full" className='w-full font-semibold text-lg'>
                    Signup
                  </Button>
                
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

      </form>

    </>
  )
}

export default CompanySignup
