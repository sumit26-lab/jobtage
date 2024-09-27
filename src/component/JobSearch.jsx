// src/pages/JobSearchPage.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {useAxiosPrivate} from '../hook/useAxiosPrivate'
import { Joblistings } from '../component/Joblistings'; // This component will display the job posts
import useAuth from '../hook/useAuth';

import { toast } from 'react-toastify';
const JobSearchPage = () => {
    const [query, setQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC'); // 'asc' or 'desc'
    const [sortBy, setSortBy] = useState('jt.salary'); // 'date' or 'salary'
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);
    const [search, setSearch] = useState('');// 'all', 'active', 'closed'
    const [jobPosts, setJobPosts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const { auth } = useAuth()
    const [ isposted,setisposted]=useState(false)
    const { user_account_id = null, roles_id = null } = auth? auth.data : {};
    
  
const axiosPrivate=useAxiosPrivate() 
    



 const fetchJobPosts = async (signal) => {
    console.log("component mount",auth)
        try {
          if(user_account_id==null) return
           
    

            const response = await axiosPrivate.get(`api/job_Post/${user_account_id}`, {
                params:{ page,
                sortBy,
                limit,
                sortOrder,
                search
            },
                signal

        }) 
        console.log("Job data",response.data)
         let data= await response.data
       
         if(data.rows.length >0){
         
            setJobPosts(data.rows)
        
            setisposted(true)

            setTotalCount(data.totalCount)
            setLoading(false)
         }
        else{
              
                const response = await axiosPrivate.get(`api/job_Post`, {
                    params:{ page,
                    sortBy,
                    limit,
                    sortOrder,
                    search
                },
                    signal

    
            })
            let data= await response.data
            setJobPosts(data.rows)
        
            

            setTotalCount(data.totalCount)
            }
        } catch (err) {
            if (err.name === 'CanceledError') {
                console.log('Request canceled');
            } else {
                toast.error('Error fetching job posts:', err);
                // Optional: Navigate to login if unauthorized
                // navigate('/login');
            }
        }
        finally{
            setLoading(false)
        }
    }


    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
     
        setLoading(true); // Start loading indicator
        fetchJobPosts(signal);
    
        return () => {
            controller.abort(); // Cleanup function to abort the request if the component unmounts
        };
    }, [page, sortBy, sortOrder, search]); // Dependencies array
    
    
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        fetchJobPosts(new AbortController().signal); // Fetch job posts based on new query
    };
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const totalPages = Math.ceil(totalCount / limit);
//   console.log("totalPages",totalPages)
console.log("sortBy",sortBy)
    return (
        <div className="container mx-auto p-6">
             {jobPosts.length ==0?<h1 className='flex justify-center'>

                No Job Post Found...
             </h1> :<> 
          {isposted ?  <h1 className="text-2xl font-bold mb-4">Manage Job Posts</h1>:  <h1 className="text-2xl font-bold mb-4">Search Job Any Where</h1>}

            <form onSubmit={handleSearch} className="mb-6 flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search for job posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 p-2 border rounded-md w-full md:w-80"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-md"
                >
                    Search
                </button>

                <div className="flex items-center space-x-4">
                    <label htmlFor="sort-by" className="text-gray-700">Sort by:</label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border p-2 rounded-md"
                    >
                        <option value="jp.createat">Date Posted</option>
                        <option value="jt.salary">Salary</option>
                    </select>

                    <label htmlFor="sort-order" className="text-gray-700">Order:</label>
                    <select
                        id="sort-order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border p-2 rounded-md"
                    >
                        <option value="DESC">Descending</option>
                        <option value="ASC">Ascending</option>
                    </select>
                   { isposted && (
                <NavLink className="bg-blue-500 text-white p-2 rounded-md mt-4" to="add-job">
                    Post Jobs
                </NavLink>
            )}
                </div>
            </form>
      
             <Joblistings isLoading={Loading} jobPosts={jobPosts} isHome={false} />
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="bg-blue-500 text-white p-2 rounded-md mx-1"
                >
                    Previous
                </button>
                <span className="mx-2">{page} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="bg-blue-500 text-white p-2 rounded-md mx-1"
                >
                    Next
                </button>
            </div> 
            </>}
           

            {/* Pagination Controls */}
            
        </div>
    );
};


export default JobSearchPage;