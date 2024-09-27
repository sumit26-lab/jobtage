import React, { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

import {useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [identifyer, setidentifyer] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Make a POST request to the backend server
     let data=  await axios.post('/api/user/forgetpassword',{identifyer});
     
    //console.log("error",data)
      toast.success('Password reset link sent to your email.');
      setTimeout(() => navigation('/'), 3000); // Redirect after 3 seconds
    } catch (err) {
      //console.log("show",err)
      if(err.response &&  err.response.status==400){
       return toast.error(err.response.data.errors[0])
      }
      else{
        return toast.error(err)
      }
          }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Forgot Your Password?</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email or Username:</label>
            <input
              type="text"
              id="email"
              value={identifyer}
              onChange={(e) => setidentifyer(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-700 border text-white font-semibold rounded-md hover:bg-indigo-900"
          >
            Send Reset Link
          </button>
          {message && <p className="mt-4 text-green-600">{message}</p>}
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
