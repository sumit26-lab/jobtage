import { useParams, useLoaderData, Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaMapMarker, FaSadCry } from 'react-icons/fa'
import { toast } from 'react-toastify'
import useAuth from '../../hook/useAuth'
import {useAxiosPrivate} from '../../hook/useAxiosPrivate'
import { useState, useEffect } from 'react'


export const Jobpage = ({ deleteJob }) => {
    let { id } = useParams()
    console.log("userCheckId",id)
    const { auth } = useAuth()

    const { user_account_id = null, roles_id = null } = auth?.data || {};
    console.log("userAccountId",roles_id)
    const axiosPrivate = useAxiosPrivate()
    const [jobs, setJobs] = useState([]);
    const [Loading, setLoading] = useState(true);
    const[isjobpostuser,setisjobpostuser]=useState(false)
    const[hasApplied,sethasApplied]=useState(false)
  
   async function jobAllreadyApply() {
    try {
        const response = await axiosPrivate.get(`/api/jobapply/${id}/${user_account_id}`);
        if (response.data) {
            sethasApplied(true)
         console.log("Id is Avliable",response.data)
        } else {
            sethasApplied(false)
            console.log("Id is Not Avliable",response.data)
            // setError('Something went wrong');
        }
    } catch (err) {
       console.error(err)
    } finally {
        setLoading(false);
    }
    
   }
   
    let navigation = useNavigate()
    const fetchJobPosts = async (signal) => {
        try {
            const response = await axiosPrivate.get(`api/job_Post/getJobId/${id}`, {

                signal

            })
            let res= await response.data.data
            console.log("jobs",res)
            if(res.posted_by_id==user_account_id||roles_id==3){
                setisjobpostuser(true)
            }
            setJobs(res)

            setLoading(false)
        } catch (err) {
            if (err.name === 'CanceledError') {
                console.log('Request canceled');
            } else {
                console.error('Error fetching job posts:', err);
                // Optional: Navigate to login if unauthorized
                // navigate('/login');
            }
        }
    }
    async function onclickdeleteJob(id) {
        try {
            const {signal}= new AbortController()
            setLoading(true)
            const job_type = await axiosPrivate.delete(`api/job_type/${jobs.job_type_id}`, {

                signal
              });
            const Job_response = await axiosPrivate.delete(`api/job_Post/${jobs.job_post_id}`, {

                signal

            })
            let result_job = await Job_response.status
            if (result_job == 204) {
                const response = await axiosPrivate.delete(`api/job_loaction/${jobs.job_location_id}`, { signal }

                )

            }

            toast.success('deleted Successfuliy..')
            navigate('/dashboard')

            setLoading(false)
        } catch (err) {
           toast.error(err.message)
        }
        finally{
            setLoading(false)
        }

    }
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        setLoading(true); // Start loading indicator
        fetchJobPosts(signal)
        if(id){

            jobAllreadyApply()
        }

        return () => {
            controller.abort(); // Cleanup function to abort the request if the component unmounts
        };
    }, [])
    if (!jobs) {
        return (
            <div>
                <h1>Job Not Found</h1>
                <Link to="/jobs" className="text-indigo-500 hover:text-indigo-600 flex items-center">
                    <FaArrowLeft className='mr-2' /> Back to Job Listings
                </Link>
            </div>
        );
    }
    return (
        <>
            <h1>JobPage</h1>
            <section>
                <div className="container m-auto py-6 px-6">
                    <Link
                        to="/dashboard"
                        className="text-indigo-500 hover:text-indigo-600 flex items-center"
                    >
                        <FaArrowLeft className='mr-2' />Back to Job Listings
                    </Link>
                </div>
            </section>

            <section className="bg-indigo-50">
                <div className="container m-auto py-10 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
                        <main>
                            <div
                                className="bg-white p-6 rounded-lg shadow-md text-center md:text-left"
                            >
                                <div className="text-indigo-800 text-lg font-bold mb-6">{jobs.title}</div>
                                <h1 className="text-1 font-bold mb-4">
                                    {jobs.type}
                                </h1>
                                <div
                                    className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start"
                                >
                                    <FaMapMarker className='text-orange-700 mr-2' />
                                    <p className="text-orange-700">{jobs.job_city} / {jobs.job_state}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                                <h3 className="text-indigo-800 text-lg font-bold mb-6">
                                    JOb Description
                                </h3>

                                <p className="mb-4">
                                    {jobs.description}
                                </p>

                                <h3 className="text-indigo-800 text-lg font-bold mb-2">Salary</h3>

                                <p className="mb-4">{jobs.min_salary} / {jobs.max_salary}</p>
                                <h3 className="text-indigo-800 text-lg font-bold mb-2">address</h3>
                                <p className="mb-4">{jobs.job_street_address}</p>

                                <h3 className="text-indigo-800 text-lg font-bold mb-2">Skill</h3>
                                <p className="mb-4">{jobs.skills_required}</p>
                                <h3 className="text-indigo-800 text-lg font-bold mb-2">experience</h3>
                                <p className="mb-4">{jobs.experience_required} /Years</p>
                                <h3 className="text-indigo-800 text-lg font-bold mb-2">Qualfication</h3>
                                <p className="mb-4">{jobs.qualification} </p>
                                <hr className="my-4" />
                                <h3 className="text-xl font-bold mb-4">Company Info</h3>

                                <h2 className="text-2xl">{jobs.company_name}</h2>

                                <p className="my-2">
                                    {jobs.company_description}
                                </p>
                                <p className="my-2">
                                    <h3 className="text-xl font-bold mb-2">Company Web</h3>
                                    {jobs.company_web}
                                </p>

                                <h3 className="text-xl">Contact Email:</h3>

                                <p className="my-2 bg-indigo-100">{jobs.company_email}</p>

                                <h3 className="text-xl">Contact Phone:</h3>

                                <p className="my-2 bg-indigo-100 p-2 font-bold">{jobs.company_contactnum}</p>
                            </div>
                            {isjobpostuser ?<div className="bg-white p-6 rounded-sm shadow-md mt-6">
                                <h3 className="text-xl font-bold mb-6">Manage Job</h3>
                                <Link
                                    to={`Edit-jobs/${jobs.id}`}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                                >Edit Job</Link>
                                <button
                                    onClick={() => onclickdeleteJob(jobs.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                                >
                                    Delete Job
                                </button>
                            </div>:<Link
                                    to={hasApplied ?'#' :`/apply/${id}`}
                                    className={`bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block ${hasApplied ? 'cursor-not-allowed opacity-50' : ''}`}
                                    aria-disabled={hasApplied}>   {hasApplied ? 'Already Applied' : 'Apply Job'}</Link>}
                        </main>

                        {/* <aside>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold mb-6">Company Info</h3>

                                <h2 className="text-2xl">{jobs.company_name}</h2>

                                <p className="my-2">
                                    {jobs.company_description}
                                </p>
                                <p className="my-2">
                                <h3 className="text-xl font-bold mb-6">Company Email</h3>
                                    {jobs.company_web}
                                </p>
                                

                         <hr className="my-4" />

                                <h3 className="text-xl">Contact Email:</h3>

                                <p className="my-2 bg-indigo-100">{jobs.company_email}</p>

                                <h3 className="text-xl">Contact Phone:</h3>

                                <p className="my-2 bg-indigo-100 p-2 font-bold">{jobs.company_contactnum}</p>
                            </div>


                            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                                <h3 className="text-xl font-bold mb-6">Manage Job</h3>
                                <Link
                                    to={`Edit-jobs/${jobs.id}`}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                                >Edit Job</Link>
                                <button
                                   onClick={()=> onclickdeleteJob(jobs.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                                >
                                    Delete Job
                                </button>
                            </div>
                        </aside> */}
                    </div>
                </div>
            </section>
        </>
    )
}


export { Jobpage as default }