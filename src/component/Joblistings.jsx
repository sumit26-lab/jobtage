import React from 'react'
import jobjson from '../jobs.json'
import Joblisting from './Joblisting'
import { useState, useEffect } from 'react'
import { Spinner } from './Spinner'
import axios from '../api/axios'

export const Joblistings = ({ isHome  ,jobPosts,isLoading}) => {
    // let joblisteing= isHome ? jobjson.slice(0,3):jobjson
    console.log("JobListing",jobPosts)
    const [Jobs, setJobs] = useState([])
    // const [Loding, setLoading] = useState(true)
    // let url =isHome ? 'http://localhost:4000/api/job_Post':'/api/jobs'
//  let joblisteing=isHome?setLoading(false)
async function fetchingJobs(){
    try {
         
            let res = await axios(`api/user/getRecentJob`)
            let result =  await res.data ;
           console.log("job-data",result.rows)

            setJobs(result.rows)
        }
      
    catch (err) {

    }
    
}
    useEffect(() => {
        if(jobPosts ==undefined){
            fetchingJobs()
        }

    }, [])
    return (
        <section className="bg-blue-50 px-4 py-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
                    {isHome ? 'Recent_job' : 'Browse Jobs'}
                </h2>

                {isHome ?<>{isLoading ? <Spinner loading={isLoading} /> :
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{Jobs?.map((job) => (
                        <Joblisting key={job.job_post_id} job={job} isHome={isHome} />
                    ))}


                    </div>
                }</>:<>{isLoading ? <Spinner loading={isLoading} /> :
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{jobPosts?.map((job) => (
                    <Joblisting key={job.job_post_id} job={job} />
                ))}


                </div>
            }</>}

                




            </div>
        </section>
    )
}
