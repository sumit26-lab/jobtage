// src/OtpVerification.js

import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../Otp.css';
import axios from '../../api/axios'; // Adjust the path based on your project structure
import useAuth from '../../hook/useAuth';
const OTPVerification = ({ isOpen, onClose,email }) => {
    const { auth,setpersist } = useAuth()
    console.log("IsOpen--",isOpen,email)
    const [timeLeft, setTimeLeft] = useState(60); // Timer in seconds
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
   

    useEffect(() => {
        const countdown = () => {
            if (timeLeft > 0) {
                setTimeLeft(prevTime => prevTime - 1);
            }
        };

        const timer = setInterval(countdown, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const resendOtp = async () => {
        console.log("ResentEmail",email,otp)
        setLoading(true);
        try {
            const res = await axios.post('api/user/ResendOtp', JSON.stringify({ email }));
            if (res.status === 200) {
                toast.success('OTP sent successfully to your email!');
            }
        } catch (error) {
            toast.error('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const data = { otp, email };
            const res = await axios.post('api/user/verifyOtp', JSON.stringify(data));
            console.log("isvalid",res.data.status)
            if (res.data.status =='valid') {
                toast.success('User successfully verified!');
                setpersist(false)
                await localStorage.setItem('persist',false)
                window.location.href = '/Login'
            } else {
                const errorData = await res.data; // Adjust based on your API response structure
                errorData.errors.forEach(error => {
                    toast.error(error.msg);
                });
            }
        } catch (error) {
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6 text-center">OTP Verification</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP:</label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={handleOtpChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            maxLength="6"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Verify OTP'}
                        </button>
                        <div className="text-sm font-medium text-gray-700">
                            {timeLeft > 0 ? `Resend OTP in ${timeLeft} seconds` : (
                                <button 
                                    className='bg-red-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    onClick={resendOtp}
                                    disabled={loading}
                                >
                                    Resend
                                </button>
                            )}
                        </div>
                    </div>
                </form>
                <button onClick={onClose} className="mt-4 text-gray-500 underline">Close</button>
            </div>
        </div>
    );
};

export default OTPVerification;
