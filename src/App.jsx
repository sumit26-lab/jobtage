import React, { useState } from 'react'

import Mainlayout from './component/layout/Mainlayout'
import { Home } from './component/pages/Home'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import NotFoundPage from './component/pages/Notfoundpage'
import { Jobpage, } from './component/pages/Jobpage'

import { Addjobs } from './component/pages/Add-Jobs'
import { Editjobs } from './component/pages/Edit-jobs'
import Signup from './component/pages/signup'
import OTPVerification from './component/pages/OTp'
import Login from './component/pages/Login'
import { AddCompany } from './component/pages/AddCompany'

import Dashboard from './component/Desboard'
import JobSearch from './component/JobSearch'
import { UserProfile } from './component/pages/UserProfile'

import RequireAuth from './component/RequireAuth'
import {useAxiosPrivate} from './hook/useAxiosPrivate'
import PersistLogin from './component/PersistLogin'
import JobApplyReviewed from './component/pages/JobApplyReviewed'
import ForgetPassword from './component/pages/ForgetPassword'
import JobApplyPage from './component/pages/JobApplyPage'
import PasswordReset from './component/pages/Password-Reset'

function App() {
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [email, setemail] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL; // This will work only in server context
  console.log("base",baseURL)
  const openOtpModal = (email) => {
    setIsOtpModalOpen(true)
    setemail(email)
  };
  const closeOtpModal = () => setIsOtpModalOpen(false);

  const axiosPrivate = useAxiosPrivate()
  const fetchJobPosts = async ({ params }) => {
    console.log("params", params)
    let { signal } = new AbortController()
    try {
      const response = await axiosPrivate.get(`api/job_Post/getJobId/${params.id}`, {

        signal

      })
      console.log("jobPost", response.data.data)
      return response.data.data

    } catch (err) {
      return {}
    }
  }
  
  const route = createBrowserRouter(
    createRoutesFromElements(

      <Route path='/' element={<Mainlayout />} >
        <Route path='/Signup' element={<Signup openOtpModal={openOtpModal} />} />
        <Route path='/Login' element={<Login openOtpModal={openOtpModal} />} />
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path='dashboard' element={<Dashboard />}>
              <Route index element={<JobSearch />} />
              <Route path='profile' element={<UserProfile />} />
              <Route path='jobs/:id' element={<Jobpage />} />
              <Route path='Add-company' element={<AddCompany />} />
              <Route path='add-job' element={<Addjobs />} />
              <Route path='jobs/:id/Edit-jobs/:editId' element={<Editjobs />} loader={fetchJobPosts} />
              <Route path='review' element={<JobApplyReviewed />} />
              {/* jobs/10/apply/43 */}
            </Route>
            <Route path='/apply/:id' element={<JobApplyPage />} loader={fetchJobPosts} />
            <Route path='/ForgetPassword' element={<ForgetPassword />} />
            <Route path='/PasswordReset/:resetToken' element={<PasswordReset />} />

          </Route>
          <Route index element={<Home />} />
          <Route path='jobs/:id' element={<Jobpage />} />


        </Route>
        <Route path='*' element={<NotFoundPage />} />
        
      </Route>
      // {/* </> */ }









    )
  )

  return (
    <>
    <RouterProvider router={route} />
    {isOtpModalOpen && <OTPVerification isOpen={isOtpModalOpen} onClose={closeOtpModal} email={email} />}
  </>



 
  )
}

export default App