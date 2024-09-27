const formatDate = (date) => {
    if (!date) return ''; // Handle null or undefined dates
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0'); // Pad single-digit days
    return `${year}-${month}-${day}`;

};

import axios from '../../api/axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAxiosPrivate } from '../../hook/useAxiosPrivate';
import useAuth from '../../hook/useAuth';
import { useNavigate } from 'react-router-dom';

import DatePickerComponent from '../DatePickerComponent';


export const UserProfile = () => {
    const { auth,setpersist } = useAuth()
    const navigation = useNavigate()
    const { user_account_id = null, roles_id = null } = auth?.data || {};

    const [isEditing, setIsEditing] = useState(false); // To handle edit mode
    const [loading, setLoading] = useState(false);
    const [resumeKey, setresumekey] = useState("");

    // const [StartDate, setStartDate] = useState(null);
    // const [CompaliteDate, setCompaliteDate] = useState(null);
    // const [exp_start_date, setexp_start_date] = useState(null);
    // const [exp_end_date, setexp_end_date] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [dbStatus, setdbStatus] = useState(true)
    const [userStatus, setUserStatus] = useState({
        expired: false,
        fresh: false,
    })
    const [statevalue, setstatevalue] = useState([])
    const [Cityvalue, setCityvalue] = useState([])
    

    const [profileData, setProfile] = useState({
        first_name: "",
        last_name: "",
        state: "",
        city: "",
        user_account_id: user_account_id
    })
    const [skill, setskill] = useState({
        skill_name: "",
        user_account_id: user_account_id
    })
    const [education_detail, seteducation_detail] = useState({
        user_account_id: user_account_id,
        major: "",
        institute_university_name: "",
        start_date: "",
        completion_date: ""
    })

    const [experience_detail, setexperience_detail] = useState({
        user_account_id: user_account_id,
        company_name: "",
        job_location_city: "",
        job_location_state: "",
        exp_start_date: "",
        exp_end_date: "",
        description: "",
        currentsalary:0
    })
    const [resume, setresume] = useState({
        resume_url: "",
        uploaded_at: "",
        file_size: 0,
        file_type: "",
        user_account_id: user_account_id,

    })

    useEffect(() => {
        if (profileData.state.length > 0) {
            fetchCity(profileData.state)
        }
        async function fetchStateApi() {
            try {

                let result = await axios.get('api/user/getState')
                if (result.status == 200) {

                    setstatevalue(result.data.state)
                }
            }
            catch (err) {
                console.error("Error fetching states:", error);
                toast.error('Failed to fetch states.');
            }




        }
        fetchStateApi()

        if (user_account_id) {
            console.log("userId", user_account_id)




            async function getData() {
                const { signal } = new AbortController();
                try {
                    const { data } = await axiosPrivate.get(`api/Jobprofile/${user_account_id}`, { signal });
                    console.log("Pro", data)
                    if (data.length > 0) {
                        const profile = data[0];
                        console.log("profile...>", profile)
                        if (profile.user_status === "fresh") {
                            setdbStatus(false)
                        }
                        setProfile((prev) => ({
                            ...prev,
                            first_name: profile.first_name || "",
                            last_name: profile.last_name || "",
                            state: profile.state || "",
                            city: profile.city || "",
                            user_account_id: user_account_id
                        }));
                        setresumekey(profile.resume_url || "")
                        setskill((prev) => ({
                            ...prev,
                            skill_name: profile.skill_name
                        }))
                        seteducation_detail((prev) => ({
                            ...prev,
                            user_account_id: user_account_id,
                            major: profile.major || "",
                            institute_university_name: profile.institute_university_name || "",
                            start_date: profile.start_date || "",
                            completion_date: profile.completion_date || ""
                        }));
                        if(profile.company_name){

                            setexperience_detail((prev) => ({
                                ...prev,
                                user_account_id: user_account_id,
                                company_name: profile.company_name || "",
                                job_location_city: profile.job_location_city || "",
                                job_location_state: profile.job_location_state || "",
                                exp_start_date: profile.exp_start_date || "",
                                exp_end_date: profile.exp_end_date || "",
                                description: profile.description || "",
                                currentsalary: profile.currentsalary || "",
                            }));
                        }
                        setIsEditing(true);
                    } else {
                        setIsEditing(false);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            getData();
        }
    }, [user_account_id, axiosPrivate, profileData.state]);

    const ExpStartHandler = (date) => {
        setexperience_detail((prevState => ({
            ...prevState,
            exp_start_date: formatDate(date)

        }))

        )
    }

    const ExpEndHandler = (date) => {
        setexperience_detail((prevState => ({
            ...prevState,
            exp_end_date: formatDate(date)

        }))

        )
    }

    const handleStartDateChange = (date) => {
        seteducation_detail((prevState) => ({
            ...prevState,
            start_date: formatDate(date)
        }));
    };
    const handleCompletionDateChange = (date) => {
        seteducation_detail((prevState) => ({
            ...prevState,
            completion_date: formatDate(date)
        }))
    }
    async function fetchCity(state) {

        try {

            let result = await axios.get(`api/user/getCity/${state}`)
            if (result.status == 200) {
                console.log("CityValue", result.data)
                setCityvalue(result.data.cities)
            }

        } catch (err) {
            console.error(err)
        }
    }


    const changesHandler = (e, setter) => {
        let { name, value } = e.target;
        setter(prval => ({
            ...prval,
            [name]: value
        }))

    }



    console.log("ExperinecFilde",experience_detail.company_name)

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const deleteHandler = async () => {
        const { signal } = new AbortController();
        try {
            let key = resumeKey.split('.com/')[1]
            await axiosPrivate.delete(`api/resume/${user_account_id}`, { data: { key: key } })
            await axiosPrivate.delete(`api/Jobprofile/${user_account_id}`, { signal });
            await axiosPrivate.delete(`api/eduction_details/${user_account_id}`, { signal });
            if(experience_detail.company_name.length >0){

                await axiosPrivate.delete(`api/experience_detail/${user_account_id}`, { signal });
            }
            await axiosPrivate.delete(`api/Job_skiil/${user_account_id}`, { signal });
            await axiosPrivate.delete(`/api/jobapply/${user_account_id}`, { signal })
            await axios.delete(`api/user/${user_account_id}`)
            await toast.success('delete Succefuliy')
            setpersist(false)
            await navigation('/Signup')

        }
        catch (err) {
            toast.error(err)
            console.error(err)
        }
    }
    const submitFormHandler = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        const { signal } = new AbortController


        try {
            const responseResume = await axiosPrivate.post('api/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                signal
            });
         
            const responseProfile = await axiosPrivate.post('/api/Jobprofile', profileData, { signal });
            const responseEducation = await axiosPrivate.post('/api/eduction_details', education_detail, { signal });

            const responseSkill = await axiosPrivate.post('/api/Job_skiil', skill, { signal });
            if (userStatus.expired == true) {
                const responseExperience = await axiosPrivate.post('/api/experience_detail', experience_detail, { signal });

            }
            console.log('Skill response:', responseSkill.data);
            await toast.success('Form submitted successfully!');
            await navigation('/dashboard')





        }



        catch (error) {
            console.error('Error:', error.message);
            toast.error('An unexpected error occurred.');
        }
    };
    const toggleUserStatus = (status) => {

        setUserStatus((prevData) => ({
            expired: status === 'expired' ? !prevData.expired : false,
            fresh: status === 'fresh' ? !prevData.fresh : false,
        }))
    };
    let experienceFields = null;
    if (userStatus.expired || experience_detail.company_name.length >0) {
        experienceFields = (
            <>
                <div className="mb-4" htmlFor="company_name">
                    <label className="block text-gray-700 font-bold mb-2">Company name</label>
                    <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        className="border rounded w-full py-2 px-3 mb-2"
                        placeholder="e.g. Beautiful Apartment In Miami"
                        value={experience_detail.company_name}
                        onChange={(e) => changesHandler(e, setexperience_detail)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="currentsalary" className="block text-gray-700 font-bold mb-2">Current Salary</label>
                    <input
                        type="text"
                        id="currentsalary"
                        name="currentsalary"
                        className="border rounded w-full py-2 px-3 mb-2"
                        placeholder="e.g. 50000"
                        value={experience_detail.currentsalary}
                        onChange={(e) => changesHandler(e, setexperience_detail)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="start_date" className="block text-gray-700 font-bold mb-2">Joining date</label>
                    <DatePickerComponent selectedDate={experience_detail.exp_start_date} onChange={ExpStartHandler} />
                </div>
                <div className="mb-4">
                    <label htmlFor="completion_date" className="block text-gray-700 font-bold mb-2">Date of Relieving</label>
                    <DatePickerComponent selectedDate={experience_detail.exp_end_date} onChange={ExpEndHandler} />
                </div>
            </>
        );
    }

    return (
        <section className="bg-indigo-50">
            <div className="container m-auto max-w-2xl py-24">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <form onSubmit={submitFormHandler}>
                        <h2 className="text-3xl text-center font-semibold mb-6">{isEditing ? 'Edit Profile' : 'Add Profiles'}</h2>
                        {loading && <span className='mb-4 flex justify-center'><Spinner /></span>}

                        <div className="mb-4">


                            <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                            >First Name</label
                            >
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                className="border rounded w-full py-2 px-3 mb-2"
                                placeholder="e.g. Beautiful Apartment In Miami"
                                value={profileData.first_name}
                                onChange={(e) => changesHandler(e, setProfile)}
                            />

                        </div>
                        <div className="mb-4">


                            <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                            >Last Name</label
                            >
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                className="border rounded w-full py-2 px-3 mb-2"
                                placeholder="e.g. Beautiful Apartment In Miami"
                                value={profileData.last_name}
                                onChange={(e) => changesHandler(e, setProfile)}
                            />

                        </div>

                        <div className="mb-4">


                            <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                            > Skill</label
                            >
                            <input
                                type="text"
                                id="skill_name"
                                name="skill_name"
                                className="border rounded w-full py-2 px-3 mb-2"
                                placeholder="e.g. Beautiful Apartment In Miami"
                                value={skill.skill_name}
                                onChange={(e) => changesHandler(e, setskill)}
                            />

                        </div>
                        <div className="mb-4">




                            <label htmlFor="major" className="block text-gray-700 font-bold mb-2"
                            > Major</label
                            >
                            <input
                                type="text"
                                id="major"
                                name="major"
                                className="border rounded w-full py-2 px-3 mb-2"
                                placeholder="e.g. Beautiful Apartment In Miami"
                                value={education_detail.major}
                                onChange={(e) => changesHandler(e, seteducation_detail)}
                            />

                        </div>
                        <div className="mb-4">


                            <label htmlFor="institute_university_name" className="block text-gray-700 font-bold mb-2"
                            >  institute University Name</label
                            >
                            <input
                                type="text"
                                id="institute_university_name"
                                name="institute_university_name"
                                className="border rounded w-full py-2 px-3 mb-2"
                                placeholder="e.g. Beautiful Apartment In Miami"
                                value={education_detail.institute_university_name}
                                onChange={(e) => changesHandler(e, seteducation_detail)}
                            />

                        </div>
                        <div className="mb-4" htmlFor="start_date" >
                            <label htmlFor="start_date" className="block text-gray-700 font-bold mb-2">Start-date</label>
                            <DatePickerComponent selectedDate={education_detail.start_date} onChange={handleStartDateChange} />
                        </div>
                        <div className="mb-4" htmlFor="completion_date">
                            <label htmlFor="completion_date" className="block text-gray-700 font-bold mb-2">completion_date</label>
                            <DatePickerComponent selectedDate={education_detail.completion_date} onChange={handleCompletionDateChange} />
                        </div>

                        <div className="mb-4" htmlFor="state">
                            <label className="block text-gray-700 font-bold mb-2">State</label>
                            <select
                                id="state"
                                name="state"
                                className="border rounded w-full py-2 px-3 mb-2"
                                value={profileData.state}
                                onChange={(e) => changesHandler(e, setProfile)}

                            >
                                <option value="">Select a state</option>
                                {
                                    statevalue?.map((item) => (<option key={item.city_state} value={item.city_state}>
                                        {item.city_state}
                                    </option>))
                                }

                            </select>
                        </div>
                        <div className="mb-4" htmlFor="city">
                            <label className="block text-gray-700 font-bold mb-2">City</label>
                            <select
                                id="city"
                                name="city"
                                className="border rounded w-full py-2 px-3 mb-2"
                                value={profileData.city}
                                onChange={(e) => changesHandler(e, setProfile)}
                            >
                                <option value="">Select a state</option>
                                {
                                    Cityvalue?.map((item) => (<option key={item.city_id} value={item.city_name}>
                                        {item.city_name}
                                    </option>))
                                }

                            </select>
                        </div>

                        {!isEditing ? <><div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">'What Kind Of Job Are You Looking For?</label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded-lg border ${userStatus.expired ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                                    onClick={() => toggleUserStatus('expired')}
                                >
                                    Expired
                                </button>
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded-lg border ${userStatus.fresh ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
                                    onClick={() => toggleUserStatus('fresh')}
                                >
                                    Fresh
                                </button>
                            </div>
                        </div></> : null}




                     


                        {experienceFields}

                            <div className='mb-4'>
                                <h1>Upload Image</h1>
                                <input type="file" accept="/*" name='file' onChange={onFileChange} />
                                {/* <button onClick={onFileUpload} >Upload</button> */}
                                <p>{message}</p>


                            </div>



                        <div className="flex justify-between">
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-1/2 focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                {isEditing ? 'Update Profile' : 'Add Profile'}
                            </button>
                            {isEditing && (
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-1/2 focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={deleteHandler}
                                >
                                    Delete Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
