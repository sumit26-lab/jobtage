import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, } from 'react-toastify';
import DatePickerComponent from '../DatePickerComponent';
import { Spinner } from '../Spinner';
import { jwtDecode } from 'jwt-decode';
import useAuth from '../../hook/useAuth';
import { useAxiosPrivate } from '../../hook/useAxiosPrivate';
import axios from '../../api/axios';
export const AddCompany = ({ addJobSubmit }) => {
    const { auth, setpersist } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const [id, setcompanyId] = useState(0);
    const [company_name, setCompanyName] = useState('');
    const [company_email, setCompanyEmail] = useState('');
    const [company_web, setCompanyWeb] = useState('');
    const [num_employes, setNumEmployes] = useState(1);
    const [company_description, setCompanyDescription] = useState('');
    const [company_contactnum, setCompanyContactnum] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // To handle edit mode
    const [industryOptions, setIndustryOptions] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [businesStreamOptions, setbusinesStreamOptions] = useState([]);
    const [selectedbusinessStream, setSelectedbusinessStream] = useState('');

    // const [industry_click, setindustyclick] = useState(false)
    // const [business_click, setbusinessclick] = useState(false)
    const [locationId, setloactionId] = useState(0)
    const [statevalue, setstatevalue] = useState([])
    const [Cityvalue, setCityvalue] = useState([])
    const [company_loaction, setCompanylocation] = useState({
        street_address: "",
        city: "",
        state: "",
       
    })






    const { user_account_id = null, roles_id = null } = auth?.data || {};


    
    const FetchAlldata = async (signal) => {
        try {
            //fetchIndustry data
             console.log("FetchAlldata--call")
            let industry_res = await axiosPrivate.get(`api/company/Industry`, {
                signal
            })

            setIndustryOptions(industry_res.data)
            let result = await axios.get('api/user/getState')
            setstatevalue(result.data.state)

           


        } catch (error) {
            console.log(error)
        }
    }
    // Zipcode  Api  fetch location company if Zip code enter and fetch industry
    async function fetchCity(state) {

        try {

            let result = await axios.get(`api/user/getCity/${state}`)
            if (result.status == 200) {
                console.log("CityValue", result.data)
                setCityvalue(result.data.cities)
            }

        } catch (err) {
            console.error("Error fetching states:", err);
            toast.error(err);
        }
    }
    

    useEffect(() => {
        //working in edit mode 
        FetchAlldata()
     
        if (company_loaction.state.length > 0) {
            fetchCity(company_loaction.state)
        }
      
    }, [ company_loaction.state])


    //fetchBusiness_Stream data
    const controller = new AbortController();

    const { signal } = controller;
    const SetIndustryandbuisnesData = async (value) => {
        console.log("IndustryId", value)
        try {

            const responsebusinessStream = await axiosPrivate.get(`api/buisnessStream/${value}`, { signal })
            //setIndustryOptions([responsebusinessStream.data])
            console.log("businessStreamData", responsebusinessStream.data)

            // setBusinessStreamName([responsebusinessStream.data])
            setbusinesStreamOptions(responsebusinessStream.data)
            
        } catch (error) {
            toast.error("Failed to fetch business stream data.");
        }



    }
 
    let fetchData = async (signal) => {
        try {
            //if company userId exist
            const responseCompany = await axiosPrivate.get(`api/company/${user_account_id}`, { signal })
            if (!responseCompany?.data) return setIsEditing(false)
                console.log('responseCompany',responseCompany.data)

            const GetCompanyLoaction = await axiosPrivate.get(`api/company_location/${responseCompany.data.company_locationid}`, { signal });

            let loaction = await GetCompanyLoaction?.data[0]
            console.log('loacation',loaction)

            if (!loaction) throw Error("location not found")
            let { city, state, street_address, zip, id } = loaction
        console.log("loaction",city,state,street_address)
        setCompanylocation(preval=>({
            ...preval,
            state:state,
            city:city,
            street_address:street_address

        }))
            // setCompanylocation({
            //     city: city,
            //     state: state,
            //     street_address: street_address,
            //     zip: zip


            // })

            setloactionId(id)
           
            

            const responsebusiness = await axiosPrivate.get(`api/buisnessStream/${responseCompany.data.business_streams_id}`, { signal })

            let businessStream = await responsebusiness?.data
            console.log("business_Stream", businessStream)

            if (!businessStream) throw Error("businessStream  not found")
            // setBusinessStreamName({ name: businessStream || '' })
            let industry_res = await axiosPrivate.get(`api/company/Industry`, {
                signal
            })

            let industryData = await industry_res.data
            let data = industryData.filter((item) => item.id == responseCompany.data.business_streams_id)
            let business_data = businessStream.filter((item) => item.id == responseCompany.data.industry_id)
            console.log("company_data", responseCompany.data)
            setbusinesStreamOptions(business_data)
            setIndustryOptions(data)
            setIsEditing(true)
            setcompanyId(responseCompany.data.id || 0);
            setCompanyName(responseCompany.data.company_name || '');
            setCompanyWeb(responseCompany.data.company_web || '');
            setNumEmployes(responseCompany.data.num_employes || 1);
            setCompanyDescription(responseCompany.data.company_description || '');
            setCompanyContactnum(responseCompany.data.company_contactnum || '');
            setCompanyEmail(responseCompany.data.company_email || '');
            setSelectedDate(responseCompany.data.establishment_date ? new Date(responseCompany.data.establishment_date) : null);


        } catch (err) {
            console.log("Api is not working", err)
        }
    }
    // if(business_click){
    //     console.log("clcik..",industryOptions[0].id)
    //       SetIndustryandbuisnesData(industryOptions[0].id)
    // }
    console.log('isEditing',statevalue)
    console.log('company_locationid', locationId)
    useEffect(() => {

        const controller = new AbortController();

        const { signal } = controller;
        fetchData(signal)

    }, [])




    console.log("isEditing", isEditing)
    const formatDate = (date) => {
        if (!date) return ''; // Handle null or undefined dates
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0'); // Pad single-digit days
        return `${year}-${month}-${day}`;
    };
    //onchngaeindusrt than work
    const handleIndustryChange = (e) => {
  
        setSelectedIndustry(e.target.value);
        SetIndustryandbuisnesData(e.target.value)
      
    };
 
    const submitFormHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const establishment_date = formatDate(selectedDate);
        let companyData = {
            company_name,
            company_description,
            business_streams_id: selectedIndustry ? selectedIndustry : industryOptions[0].id,
            establishment_date,
            company_web,
            num_employes,
            user_account_id,
            company_email,
            company_contactnum,
            industry_id: selectedbusinessStream.length > 0 ? selectedbusinessStream : businesStreamOptions[0].id

        };

        try {
            const controller = new AbortController();
            const { signal } = controller;
           
            if (!isEditing) {
                //---------->post compnay loactions data
                const CompanyLoaction = await axiosPrivate.post('api/company_location', JSON.stringify(company_loaction), { signal });


                if (CompanyLoaction.data) {
                    companyData.company_locationid = await CompanyLoaction.data.id;

                    const ResponseCompany = await axiosPrivate.post('api/company', JSON.stringify({ ...companyData }),
                        { signal });
                    if (ResponseCompany.data) {
                        toast.success('Company added successfully!');
                        navigate('/dashboard')
                        setLoading(false)
                    }
                    else {
                        const errorData = await ResponseCompany.data;
                        return toast.error(errorData.error || 'Failed to add company.');
                    }

                } else {
                    const errorData = await CompanyLoaction.data;
                    toast.error(errorData.error || 'Failed to create business stream.');
                    return;
                }
            }

            else {
                //Update company data
                
                console.log("Upading.....", companyData)
                const updateResponse = await axiosPrivate.put(`api/company/${id}`, JSON.stringify(companyData), { signal })
                let upadteComapnyRes = await updateResponse
                console.log('updateRes', upadteComapnyRes)
                if (upadteComapnyRes.status == 200) {
                    console.log("insideCompanyLocation", company_loaction)

                    const updateCompanyLoaction = await axiosPrivate.put(`api/company_location/${locationId}`, JSON.stringify(company_loaction), { signal });
                    // const updateBusinessStrem = await axiosPrivate.put(`api/buisnessStream/${streamId}`, JSON.stringify(business_stream_name));

                    toast.success('Company updated successfully!');

                }

            }


        } catch (error) {
            console.error('Error:', error.message);
            toast.error('An unexpected error occurred.');
        }
        finally {
            return () => {
                controller.abort();
            };
            // setLoading(false);
        }


    }
   

    const deleteCompanyHandler = async () => {
        const controller = new AbortController();
        const { signal } = controller;
        if (window.confirm('Are you sure you want to delete this company?')) {
            setLoading(true);

            try {
                console.log(`"companyid${id}/ industryId--->${selectedIndustry}`)

                const response = await axiosPrivate.delete(`/api/company/${id}`,
                    { signal }

                );
                let deleteComapny = await response
                console.log("Company--deleted------->", deleteComapny)
                const deletedCompanyLoaction = await axiosPrivate.delete(`api/company_location/${locationId}`, { signal })
                console.log("loactionDeleted", deletedCompanyLoaction.data)



                //const deletedBusinessStrem = await axiosPrivate.delete(`api/buisnessStream/${streamId}`, { signal });

                console.log("responseData", response)

                if (deleteComapny.data) {
                    await axiosPrivate.delete(`api/job_Post/${user_account_id}`, { signal })

                    let userDelete = await axios.delete(`api/user/${user_account_id}`)

                    if (userDelete.status == 204) {

                        toast.success('User deleted successfully!');
                        setpersist(false)
                        navigate('/');
                    }
                } else {
                    const errorData = await response.data;
                    toast.error(errorData.error || 'Failed to delete company.');
                }
            } catch (error) {
                console.error('Error:', error.message);
                toast.error('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        }
    };

    console.log("selectBussinessStream....>", selectedbusinessStream)
    return (

        <section className="bg-indigo-50">
            <div className="container m-auto max-w-2xl py-24">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <form onSubmit={submitFormHandler}>
                        <h2 className="text-3xl text-center font-semibold mb-6">{isEditing ? 'Edit Company' : 'Add Company'}</h2>
                        {loading && <span className='mb-4 flex justify-center'><Spinner /></span>}

                        <div className="mb-4">


                            <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                            >Industry</label
                            >
                            <select
                                id="industry"
                                name="industry"
                                className="border rounded w-full py-2 px-3"
                                required
                                value={selectedIndustry}
                                // onClick={() => setindustyclick(!industry_click)}
                                //onChange={(e) => setSelectedIndustry(e.target.value)}
                                onChange={(e) => handleIndustryChange(e)}

                            >
                                {!isEditing && <option value="">Select</option>}
                                {industryOptions.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>


                        </div>

                        <div className="mb-4">


                            <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                            >Business_Stream</label
                            >
                            <select
                                id="Business_Stream"
                                name="Business_Stream"
                                className="border rounded w-full py-2 px-3"
                                value={selectedbusinessStream}
                                onChange={(e) => setSelectedbusinessStream(e.target.value)}
                                // onClick={() => setbusinessclick(!business_click)}


                            //onChange={(e) => setSelectedIndustry(e.target.value)}
                            >
                                {/* <option value={business_stream_name.id}>{business_stream_name.name}</option> */}
                                {!isEditing && <option value="">Select</option>}
                                {businesStreamOptions.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}



                            </select>
                        </div>
                     

                        <div className='mb-4'>
                            <label className='block text-gray-700 font-bold mb-2'>Company Name</label>
                            <input
                                type='text'
                                id='company_name'
                                name='company_name'
                                className='border rounded w-full py-2 px-3 mb-2'
                                placeholder='e.g. My Company'
                                value={company_name}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 font-bold mb-2'>Company Email</label>
                            <input
                                type='email'
                                id='company_email'
                                name='company_email'
                                className='border rounded w-full py-2 px-3 mb-2'
                                placeholder='e.g. My Company Email'
                                value={company_email}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="company_web" className="block text-gray-700 font-bold mb-2">Company Website</label>
                            <input
                                type="text"
                                id="company_web"
                                name="company_web"
                                className="border rounded w-full py-2 px-3"
                                placeholder="Company website URL"
                                value={company_web}
                                onChange={(e) => setCompanyWeb(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="num_employes" className="block text-gray-700 font-bold mb-2">Number of Employees</label>
                            <input
                                type="number"
                                id="num_employes"
                                name="num_employes"
                                className="border rounded w-full py-2 px-3"
                                placeholder="Number of employees"
                                value={num_employes}
                                onChange={(e) => setNumEmployes(e.target.value)}
                            />
                        </div>




                        <div className="mb-4">
                            <label htmlFor="company_contactnum" className="block text-gray-700 font-bold mb-2">Contact Phone</label>
                            <input
                                type="tel"
                                id="company_contactnum"
                                name="company_contactnum"
                                className="border rounded w-full py-2 px-3"
                                placeholder="Optional phone for applicants"
                                value={company_contactnum}
                                onChange={(e) => setCompanyContactnum(e.target.value)}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 font-bold mb-2'>Address</label>
                            <input
                                type='text'
                                id='street_address'
                                name='street_address'
                                className='border rounded w-full py-2 px-3 mb-2'
                                placeholder='e.g. street_address'
                                value={company_loaction.street_address}
                                onChange={(e) => setCompanylocation((preval=>({
                                    ...preval,
                                    street_address:e.target.value
                                })))}
                            />
                        </div>
                        <div className="mb-4" htmlFor="state">
                            <label className="block text-gray-700 font-bold mb-2">State</label>
                            <select
                                id="state"
                                name="state"
                                className="border rounded w-full py-2 px-3 mb-2"
                                value={company_loaction.state}
                                onChange={(e) => setCompanylocation((preval => ({
                                    ...preval,
                                    state: e.target.value
                                })))}

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
                                value={company_loaction.city}
                                onChange={(e) => setCompanylocation((preval => ({
                                    ...preval,
                                    city: e.target.value
                                })))}
                            >
                                <option value="">Select a state</option>
                                {
                                    Cityvalue?.map((item) => (<option key={item.city_id} value={item.city_name}>
                                        {item.city_name}
                                    </option>))
                                }

                            </select>
                        </div>



                        <div className="mb-4">
                            <label htmlFor="company_description" className="block text-gray-700 font-bold mb-2">Company Description</label>
                            <textarea
                                id="company_description"
                                name="company_description"
                                className="border rounded w-full py-2 px-3"
                                rows="4"
                                placeholder="Add any job duties, expectations, requirements, etc."
                                value={company_description}
                                onChange={(e) => setCompanyDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="establishment_date" className="block text-gray-700 font-bold mb-2">Establishment Date</label>
                            <DatePickerComponent selectedDate={selectedDate} onChange={(e) => setSelectedDate(e)} />
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-1/2 focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                {isEditing ? 'Update Company' : 'Add Company'}
                            </button>
                            {isEditing && (
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-1/2 focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={deleteCompanyHandler}
                                >
                                    Delete Company
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
