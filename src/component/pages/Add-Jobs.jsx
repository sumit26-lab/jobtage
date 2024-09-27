import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from '../Spinner';
import useAuth from '../../hook/useAuth';
import {useAxiosPrivate} from '../../hook/useAxiosPrivate';
export const Addjobs = ({ addJobSubmit }) => {
  const axiosPrivate = useAxiosPrivate()
  let navigate = useNavigate()
  const { auth } = useAuth()
  const [zipCodes,setZipCode]=useState('')
  const [Errors,setErro]=useState(false)
  const [job_typeData, setjob_typeData] = useState({
    description: "",
    qualification: "",
    skills_required: "",
    experience_required: "",
    title: "",
    salary: "Select",
    type: "Select"

  })
  console.log(job_typeData.salary)
  const [job_loaction, setlocation] = useState({
    street_address: "",
    city: "",
    state: "",
    zip: ''
  })

  const [loading, setLoading] = useState(false);
  

  const typeHandler = (e) => {
    const { name, value } = e.target;
    setjob_typeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  console.log("job_loaction.zip.length",job_loaction.zip )
 
  
useEffect(()=>{
  console.log("ApiHit")
  if(zipCodes.length >=6){
    const fetchData=async()=>{
      setLoading(true)
        try {
          const response = await fetch(`https://api.zippopotam.us/in/${zipCodes}`);
           
          // Check if the response is not OK
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          if (data.places && data.places.length > 0) {
            // Extract the city name from the full place name
            const fullPlaceName = data.places[0]['place name'];
            const state = fullPlaceName.split(' ')[0]; // Assuming city name is the first part
            let zipCode=data['post code']
            let city=data.places[0].state
            let address= data.places[0]['place name']
           setlocation({
            city: city,
            state:state,
            zip:zipCode,
            street_address:address
          })
          } 
         
        
      
          
        }
    
        catch (err) {
          setLoading(false)
          toast.error("Enter Zipcode Not Foud")
          setErro(true)
          console.log(err)
        }
      }
   fetchData()
  
  }
},[zipCodes])


const { user_account_id = null, roles_id = null } = auth?.data || {};



  const submitFormHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log(job_typeData, job_loaction)

    //api in type
    try {

      let Data = {};
      const controller = new AbortController();
      const { signal } = controller;
      const job_type = await axiosPrivate.post('api/job_type', JSON.stringify(job_typeData), {

        signal
      });

      console.log("status", job_type.status)
      if (job_type.status == 200) {
        let { id } = await job_type.data
        console.log("job_typeId", id)
        Data.job_type_id = id
        const loctaion = await axiosPrivate.post('api/job_loaction', JSON.stringify(job_loaction), {
          signal
        });
        Data.job_location_id=loctaion.data.id
        if (loctaion.data.id && loctaion.status==200) {
          let Comapny = await axiosPrivate.get(`api/company/${user_account_id}`)

          Data.company_id = Comapny.data.id
          Data.posted_by_id = user_account_id



          console.log("AllData",Data)

          const jobpost = await axiosPrivate.post('api/job_Post', JSON.stringify(Data), {

          });
          if (jobpost.status==200) {

            toast.success('You Job Post Sucessfuliy add..')
              navigate('/dashboard')

          }


      }

      } else {
        const errorData = await stream.json();
        toast.error(errorData.error || 'Failed to create business stream.');
        return;
      }
    }
    catch (err) {
      console.log(err)
    }


  }

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div
          className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
        >
          <form onSubmit={submitFormHandler}>
            <h2 className="text-3xl text-center font-semibold mb-6">Post Job</h2>



            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-bold mb-2"
              >title</label
              >
              <input
                id="title"
                name="title"
                className="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="title?"
                value={job_typeData.title}
                onChange={typeHandler}
              ></input>
            </div>
             
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 font-bold mb-2">Type</label>
              <select
                id="type"
                name="type"
                className="border rounded w-full py-2 px-3"
                required
                value={job_typeData.type}
                onChange={typeHandler}
              >
                <option value="Select" disabled>Select</option> {/* Placeholder option */}
                <option value="FullTime">Full-Time</option>
                <option value="PartTime">Part-Time</option>
                <option value="Remote">Remote</option>
                {/* <option value="Internship">Internship</option> */}
              </select>
            </div>


            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-bold mb-2"
              >Description</label
              >
              <textarea
                id="description"
                name="description"
                className="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="Add any job duties, expectations, requirements, etc"
                value={job_typeData.description}
                onChange={typeHandler}
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="qualification" className="block text-gray-700 font-bold mb-2"
              >qualification</label
              >
              <input
                type="text"
                id="qualification"
                name="qualification"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="eg. qualification"
                required
                value={job_typeData.qualification}
                onChange={typeHandler}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="skills_required" className="block text-gray-700 font-bold mb-2"
              > skills</label
              >
              <input
                type="text"
                id=" skills_required"
                name="skills_required"
                className="border rounded w-full py-2 px-3"
                placeholder=" skills_required"
                value={job_typeData.skills_required}
                onChange={typeHandler}
              />
            </div>

           
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-bold mb-2"
              >
                experience</label
              >
              <input
                id="title"
                name="experience_required"
                className="border rounded w-full py-2 px-3"
                placeholder="experience_required"
                value={job_typeData.experience_required}
                onChange={typeHandler}
              ></input>
            </div>


            <div className="mb-4">
              <label htmlFor="salary" className="block text-gray-700 font-bold mb-2"
              >Select Salay</label
              >
              <select
                id="salary"
                name="salary"
                className="border rounded w-full py-2 px-3"
                required
                value={job_typeData.salary}
                onChange={typeHandler}
              >
                <option value="Select" disabled>Select</option> {/* Placeholder option */}
                <option value="6000-20000">₹6,000.00 - ₹20,000.00 per month</option>
                <option value="20000-350000">20,000.00 - ₹35,0000.00 per month</option>
                <option value="50000-100000">50,000.00 - ₹100.,000.00 per month</option>
              </select>
            </div>


           
            <div className='mb-4'>
              <label htmlFor='city' className='block text-gray-700 font-bold mb-2'>
                ZipCode
              </label>
              <input
                type='number'
                id='zip'
                name='zip'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='number'
                required
                value={zipCodes}
                onChange={(e)=>setZipCode(e.target.value)}
              />
            </div>
            {loading ?<> <div className='mb-4'>
              <label htmlFor='city' className='block text-gray-700 font-bold mb-2'>
                city
              </label>
              <input
                type='text'
                id='city'
                name='city'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='city'
                required
                value={job_loaction.city}
                onChange={(e)=>setlocation(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='city' className='block text-gray-700 font-bold mb-2'>
                state
              </label>
              <input
                type='text'
                id='state'
                name='state'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='state'
                required
                value={job_loaction.state}
                onChange={(e)=>setlocation(e.target.value)}
                
              />
            </div>
            {/* <h3 className="text-2xl mb-5">Company Info </h3> */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-bold mb-2"
              >Address</label
              >
              <textarea
                id="street_address"
                name="street_address"
                className="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="street_address"
                value={job_loaction.street_address}
                onChange={(e)=>setlocation(e.target.value)}
              ></textarea>
            </div></>:null}
           



            <div>
              <button
                className={` bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outlin ${
                  job_loaction.zip.length >= 6 ? '':'opacity-50 cursor-not-allowed'
                }`} 
                type="submit"
                
                disabled={job_loaction.zip.length < 6}
              >
                Add Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
