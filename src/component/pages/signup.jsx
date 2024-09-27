import React, { useState } from 'react';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
import { Spinner } from '../Spinner';
import axios from '../../api/axios';


const Signup = ({openOtpModal}) => {
 
  console.log("OpenOtpModal",openOtpModal)
  const [loading, setLoading] = useState(false); // State for loading indicator

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    user_type: '', // Default value for user type
    gender: '',
    contactphone: ''
  });

console.log('User_type',formData.user_type)
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
    try {
      const {signal}= new AbortController()
      const res = await axios.post('api/user/signup',JSON.stringify(formData)
      ,{signal});
      let status= await res.status
      console.log("singup",status)
      if (status===200) {
        // Handle success
        setLoading(false)
        toast.success('User registered successfully!')
        openOtpModal(formData.email)
     
      } 
    } catch (err) {
      // console.log("error----->",error)
      if(err.response &&  err.response.status==400){
        return toast.error(err.response.data.errors[0])
       }
       else{
         return toast.error(err)
       }
    }
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
            <h2 className="text-3xl text-center font-semibold mb-6">Registration</h2>
            <div className="mb-4">

             {loading &&  <span className='mb-4 flex justify-center'><Spinner/></span>}
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Enter your username"
                autoComplete="username"
                required
                value={formData.username}
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

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Enter your email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="user_type" className="block text-gray-700 font-bold mb-2">User Type</label>
              <select
                id="user_type"
                name="user_type"
                className="border rounded w-full py-2 px-3 mb-2"
                value={formData.user_type}
                onChange={handleChange}
                required
              >  <option value="">Select</option>
                <option value="1">Job Seeker</option>
                <option value="2">Recruiter</option>

              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Contact Phone</label>
              <input
                type="tel"
                id="contactphone"
                name="contactphone"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Enter your contact phone"
                autoComplete="tel"
                value={formData.contactphone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Select Gender</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg border ${formData.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setFormData({ ...formData, gender: 'male' })}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg border ${formData.gender === 'female' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setFormData({ ...formData, gender: 'female' })}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold my-8 py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  
  );
};

export default Signup;
