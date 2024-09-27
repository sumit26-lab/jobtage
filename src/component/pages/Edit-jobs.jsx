import React, { useEffect, useState } from 'react'
import { useParams, useLoaderData, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {useAxiosPrivate} from '../../hook/useAxiosPrivate'
export const Editjobs = ({ UpdateJobSubmit }) => {
 const axiosPrivate= useAxiosPrivate()
    // console.log(jobs)
    let { editId } = useParams()
    console.log("params-data", editId)
    let jobs = useLoaderData()
    console.log("jobss", jobs)
    let navigate = useNavigate()
    const [title, setTitle] = useState(jobs?.title || '');
    const [type, setType] = useState(jobs?.type || '');
    const [location, setLocation] = useState(jobs?.job_city || '');
    const [isloading, setloading] = useState(true)
    const [description, setDescription] = useState(jobs?.description || '');
    const [isEditFrom, setisEditFrom] = useState(false)
    const [salary, setSalary] = useState(jobs?.min_salary || '');
    const [companyName, setCompanyName] = useState(jobs?.company_name || '');
    const [companyDescription, setCompanyDescription] = useState(jobs?.company_description || '');
    const [contactEmail, setContactEmail] = useState(jobs?.company_email || '');
    const [contactPhone, setContactPhone] = useState(jobs?.company_contactnum || '');
    const [zipCodes, setZipCode] = useState(jobs?.job_zip || '')
    const [experience_required, setexperience_required] = useState(jobs?.experience_required || '')
    const [qualification, setqualification] = useState(jobs?.qualification || '')
    const [skills_required, setskills_required] = useState(jobs?.skills_required || '')
    const [zipCodeFrom, setzipCodeFrom] = useState(false)
    const [job_loaction, setlocation] = useState({
        street_address: jobs?.job_street_address || '',
        city: jobs?.job_city || '',
        state: jobs?.job_state || "",
        zip: ''
    })

    useEffect(() => {
        if (jobs) {
            setloading(false)
        }
    }, [])
    useEffect(() => {
        //working in edit mode 
        // if (industry_click) {
        //     console.log("Click-industry---->",industryOptions)
        //     //setSelectedIndustry(selectedIndustry);

        //     //SetIndustryandbuisnesData(industryOptions[0].id)
        // //    let [id]=businesStreamOptions?.map((itam)=>itam.id)

        // //     SetIndustryandbuisnesData(id)
        //     fetchIndustyData()
        // }

        console.log("ApiHit")
        if (zipCodes.length >= 6) {
            const fetchData = async () => {
                setloading(true)
                setzipCodeFrom(true)
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
                        let zipCode = data['post code']
                        let city = data.places[0].state
                        let address = data.places[0]['place name']
                        setlocation({
                            city: city,
                            state: state,
                            zip: zipCode,
                            street_address: address
                        })
                    }




                }

                catch (err) {
                    setloading(false)
                    setzipCodeFrom(true)
                    toast.error("Enter Zipcode Not Foud")

                    console.log(err)
                }
                finally {
                    setloading(false)
                }
            }
            fetchData()

        }
    }, [zipCodes])
    console.log('upadteZipCode', zipCodes, job_loaction.zip)
    const submitFormHandler = async (e) => {
        e.preventDefault()
        let upadte_Job_type = {
            title,
            type,
            description,
            salary,
            skills_required,
            qualification,
            experience_required

        }
        let upadte_job_location = {
            street_address: job_loaction.street_address,
            city: job_loaction.city,
            state: job_loaction.state,
            zip: job_loaction?.zip ? job_loaction.zip : zipCodes,
        }
        try {
           

            const controller = new AbortController();
            const { signal } = controller;
            const job_type = await axiosPrivate.put(`api/job_type/${jobs?.job_type_id}`, JSON.stringify(upadte_Job_type), {

                signal
            });

            console.log("status", job_type.status)
            if (job_type.status == 201) {
                let { id } = await job_type.data
        

                const loctaion = await axiosPrivate.put(`api/job_loaction/${jobs.job_location_id}`, JSON.stringify(upadte_job_location), {
                    signal
                });
                toast.success('You Job Updated Sucessfuliy... ')
                navigate('/dashboard')
            }




            else {
        
                toast.error(errorData.error || 'Failed to create.');
                return;
            }
        }
        catch (err) {
            console.log(err)
        }
        // UpdateJobSubmit(newJobs)

    }
    return (

        <section className="bg-indigo-50">
            <div className="container m-auto max-w-2xl py-24">
                <div
                    className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
                >
                    <form onSubmit={submitFormHandler}>
                        <h2 className="text-3xl text-center font-semibold mb-6"> Jobs</h2>

                        <div className="mb-4">
                            <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                            >Job Type</label
                            >
                            <select
                                id="type"
                                name="type"
                                className="border rounded w-full py-2 px-3"
                                required
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Remote">Remote</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >title</label
                            >
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="border rounded w-full py-2 px-3 mb-2"
                                placeholder="eg. Beautiful Apartment In Miami"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                value={qualification}
                                onChange={(e) => setqualification(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="qualification" className="block text-gray-700 font-bold mb-2"
                            >Experiance</label
                            >
                            <input
                                type="text"
                                id="experience_required"
                                name="experience_required"
                                className="border rounded w-full py-2 px-3 mb-2"
                                placeholder="eg. experience_required"
                                required
                                value={experience_required}
                                onChange={(e) => setexperience_required(e.target.value)}
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
                                value={skills_required}
                                onChange={(e) => setskills_required(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                            >Salary</label
                            >
                            <select
                                id="salary"
                                name="salary"
                                className="border rounded w-full py-2 px-3"
                                required
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
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
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                        </div>
                        {!isloading ? <> <div className='mb-4'>
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
                                onChange={(e) => setlocation(e.target.value)}
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
                                    onChange={(e) => setlocation(e.target.value)}

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
                                    onChange={(e) => setlocation(e.target.value)}
                                ></textarea>
                            </div></> : null}


                        <h3 className="text-2xl mb-5">Company Info</h3>

                        <div className="mb-4">
                            <label htmlFor="company" className="block text-gray-700 font-bold mb-2"
                            >Company Name</label
                            >
                            <input
                                type="text"
                                id="company"
                                name="company"
                                className="border rounded w-full py-2 px-3"
                                placeholder="Company Name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="company_description"
                                className="block text-gray-700 font-bold mb-2"
                            >Company Description</label
                            >
                            <textarea
                                id="company_description"
                                name="company_description"
                                className="border rounded w-full py-2 px-3"
                                rows="4"
                                placeholder="What does your company do?"
                                value={companyDescription}
                                onChange={(e) => setCompanyDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="contact_email"
                                className="block text-gray-700 font-bold mb-2"
                            >Contact Email</label
                            >
                            <input
                                type="email"
                                id="contact_email"
                                name="contact_email"
                                className="border rounded w-full py-2 px-3"
                                placeholder="Email address for applicants"
                                required
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="contact_phone"
                                className="block text-gray-700 font-bold mb-2"
                            >Contact Phone</label
                            >
                            <input
                                type="tel"
                                id="contact_phone"
                                name="contact_phone"
                                className="border rounded w-full py-2 px-3"
                                placeholder="Optional phone for applicants"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Update Job
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </section >
    )
}
