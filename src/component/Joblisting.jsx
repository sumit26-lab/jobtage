import React, { useState } from 'react'
import { FaMapMarker } from 'react-icons/fa'
import { Link } from 'react-router-dom'


const Joblisting = ({ job, isHome }) => {
    const [showdescription, setdescript] = useState(false)
    let description = job.description
    console.log("jobListing", isHome)
    if (!showdescription) {
        description = description.substring(0, 40) + '...';
    }
    return (
        <div className="bg-white rounded-xl shadow-md relative" key={job.job_post_id}>
            <div className="p-4">
                <div className="mb-6">
                    <div className="text-gray-600 my-2">{job.type}</div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                </div>

                <div className="mb-5">
                    {description}
                    <button onClick={() => setdescript((prev) => !prev)} className='text-indigo-500 md-5 hover:text-indigo-60'>{showdescription ? 'less' : 'more'}</button>
                </div>

                <h3 className="text-indigo-500 mb-2">{job.min_salary} / {job.max_salary} Year</h3>

                <div className="border border-gray-100 mb-5"></div>

                <div className="flex flex-col lg:flex-row justify-between mb-4">
                    <div className="text-orange-700 mb-3">
                        <FaMapMarker className='inline text-lg md-1 mr-1' />
                        {job.job_city}
                    </div>
                    {isHome ? <><Link
                        to={`/Login`}
                        className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                    >
                        Apply Job
                    </Link>
                    </> : <Link
                        to={`jobs/${job.job_post_id}`}
                        className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                    >
                        Read More
                    </Link>}



                </div>
            </div>
        </div>
    )
}

export default Joblisting