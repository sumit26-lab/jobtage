import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from '../Spinner';
import {jwtDecode} from 'jwt-decode';
import useAuth from '../../hook/useAuth'



import axios from '../../api/axios';
const Login = ({openOtpModal}) => 
  {
  let navigate= useNavigate()
  let {setAuth,setpersist}= useAuth()

  const location = useLocation();
  const employees = location.state?.from?.pathname || "/dashboard";


  const [loading, setLoading] = useState(false); // State for loading indicator

  const [formData, setFormData] = useState({
    identifyer: '',
    password: '',
  
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try 
    {
      const response= await axios.post('/api/user/login', JSON.stringify(formData))
     const result= await response.data
  

     //   // Handle success
    let data =  await result.accessToken?jwtDecode(result.accessToken)?.UserInfo  : {};
     
    //  if(data.is_active){
    //  
    
    //  }
       await setAuth(data)
       await localStorage.setItem('persist',true)
       setpersist(true)
       toast.success('Logeedin successfully!')
       navigate( employees,{replace:true})

  } catch (err){
    if(err.response && err.response.status==401){
      console.log("data",err.response.data.email)
     return openOtpModal(err.response.data.email)
    }
    
    if(err.response &&  err.response.status==400){
      return toast.error(err.response.data.errors[0])
     }
     else{
       return toast.error(err)
     }}
   
      finally{
      setTimeout(()=>{
        setLoading(false)

      },3000)
    }
   
     
    
  };

  return (
    
     
    <section className="bg-indigo-50">
      
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
           {/* Spinner component */}
           
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl text-center font-semibold mb-6">Login</h2>
            <div className="mb-4">

             {loading &&  <span className='mb-4 flex justify-center'><Spinner/></span>}
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username or Email</label>
              <input
                type="text"
                id="identifyer"
                name="identifyer"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Enter your username"
                autoComplete="username"
                required
                value={formData.identifyer}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Enter your password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className='md-4'>
              <NavLink to="/ForgetPassword" className="block text-red-400  font-small mb-2">Forgotten account?</NavLink>

            </div>
            <div>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold my-8 py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                SingIn
              </button>
         
            </div>
          </form>
        </div>
      </div>
    </section>
  
  );
};

export default Login;
