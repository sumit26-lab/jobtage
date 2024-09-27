import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLoaderData } from 'react-router-dom';
import useAuth from '../../hook/useAuth';
import { axiosPrivate } from '../../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';




const JobApplyPage = () => {
    const { auth } = useAuth();
    const { user_account_id = null, roles_id = null } = auth?.data || {};
    const [showdescription, setdescript] = useState(false)
    let { id } = useParams();

    console.log("jobid", id);


    const jobs = useLoaderData();
    console.log("new Jobs", jobs);
    let description = jobs.description ? jobs.description :""

    if (!showdescription) {
        description = description.substring(0, 40) + '...';
    }
    const dateString = jobs?.job_post_created_at;
    const date = new Date(dateString);
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });



    const [formData, setFormData] = useState({
        job_id: id,
        user_account_id: user_account_id,
        title: '',
        company: '',
        experience: '',
        resume: "",
        education: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value,
        });
    };

    async function getResumeUrl() {
        let resume_url = await axiosPrivate.get(`api/resume/${user_account_id}`);
        let Url = await resume_url.data;

        setFormData((prev) => ({
            ...prev,
            resume: Url.resume_url
        }));
    }

    useEffect(() => {
        if (user_account_id) {
            getResumeUrl();
        }
    }, [user_account_id]);

    console.log("jobApplyResume", formData.resume);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        console.log("formData..>", formData);

        // Uncomment and modify this section when you are ready to handle form submission
        try {
            const response = await axiosPrivate.post('/api/jobapply', formDataToSend);
            if (response.data) {
                toast.success('Apply job successFuliy..')
                navigate('/dashboard');
            } else {
                toast.error('Something went wrong')
                setError('Something went wrong');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-start bg-white p-6 shadow-md rounded-lg">
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-4">
                    <h1 className="text-2xl font-bold mb-4">Enter a past job that shows relevant experience</h1>
                    <h2 className="text-xl font-bold mb-4">Relevant experience (optional)</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-gray-700">Job title:</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                className="border p-2 rounded-md w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-gray-700">Company:</label>
                            <input
                                id="company"
                                name="company"
                                type="text"
                                value={formData.company}
                                onChange={handleChange}
                                className="border p-2 rounded-md w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="experience" className="block text-gray-700">How many years of total work experience do you have?</label>
                            <input
                                id="experience"
                                name="experience"
                                type="number"
                                value={formData.experience}
                                onChange={handleChange}
                                className="border p-2 rounded-md w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="education" className="block text-gray-700 font-bold mb-2">What is the highest level of education you have completed?</label>
                            <select
                                id="education"
                                name="education"
                                className="border rounded w-full py-2 px-3"
                                required
                                value={formData.education}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Bachelors">Bachelors</option>
                                <option value="Masters">Masters</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Higher Secondary (12-Pass)">Higher Secondary (12-Pass)</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </div>

                {/* Job Card Section */}
                <div className="w-full md:w-1/2 p-4">
                    <div className="max-w-2xl px-4 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-light text-gray-600 dark:text-gray-400">{relativeTime}</span>
                            <a className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500">
                                {jobs.title}
                            </a>
                        </div>
                        <a href="#" className="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline">
                            {jobs.company_name} {jobs.company_address}
                        </a>

                        <div className="mt-2">
                            <p className="mt-2 text-gray-600 dark:text-gray-300">

                                {description}
                                <button onClick={() => setdescript((prev) => !prev)} className='text-indigo-500 md-5 hover:text-indigo-60'>{showdescription ? 'less' : 'more'}</button>

                            </p>

                        </div>

                        <div className="flex items-center justify-between mt-4">
                            {/* <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Read more
                            </a> */}

                            <div className="flex items-center">
                                <a className="font-bold text-gray-700 cursor-pointer dark:text-gray-200">
                                    Khatab wedaa
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplyPage;
