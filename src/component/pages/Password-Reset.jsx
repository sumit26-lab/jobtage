import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {  useParams,useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const { resetToken } = useParams(); // Get the token from URL parameters
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showForm,setshowForm]=useState(false)
  const [userid,setuserid]=useState(null)
   const navigation = useNavigate();
  console.log("Params--->",resetToken)

  


  useEffect(()=>{

    const getTokendata=async()=>{
      let res= await axios.get(`api/user/resetpassword/${resetToken}`)
      console.log("res-data",res)
      if(res.data.status=="success")
      { 
        setuserid(res.data.user_account_id)
        setshowForm(true)
  
      }
      else{
           console.log("inside-showFrom",showForm)
      setTimeout(() => navigation('/'), 3000); // Redirect after 3 seconds
  //   }
      }
  
    }




    getTokendata()
    
    

  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Make a POST request to the backend server
      await axios.post(`api/user/resetpassword/${userid}`, {newPassword });
      setMessage('Password has been successfully reset.');
       setTimeout(() => navigation('/login'), 3000); // Redirect after 3 seconds
    } catch (err) {
      setError('Error resetting password. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {showForm ?<><h2 className="text-2xl font-bold mb-6 text-gray-700">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            


          >
            Reset Password
          </button>
          {message && <p className="mt-4 text-green-600">{message}</p>}
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </form>  </>:<h2 className="text-2xl font-bold mb-6 text-gray-700">Expired The Session try agin later</h2>}
        
      </div>
    </div>
  );
};

export default PasswordReset;
