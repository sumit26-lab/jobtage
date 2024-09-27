import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../../api/axios';
import useAuth from '../../hook/useAuth'
import { useLocation } from 'react-router-dom';

// Sample data - in a real app, this would come from props or state
// const jobApplications = [
//   {
//     id: 1,
//     jobTitle: 'Software Engineer',
//     company: 'Tech Corp',
//     applicationDate: '2024-08-15',
//     status: 'submitted',
//   },
//   {
//     id: 2,
//     jobTitle: 'Product Manager',
//     company: 'Innovate Ltd.',
//     applicationDate: '2024-08-20',
//     status: 'Interview Scheduled',
//   },
//   {
//     id: 3,
//     jobTitle: 'UI/UX Designer',
//     company: 'DesignWorks',
//     applicationDate: '2024-08-25',
//     status: 'Application Reviewed',
//   },
// ];

const getStatusClass = (status) => {
  switch (status) {
    case 'Rejected':
      return 'bg-red-100 text-red-700'; // Light red background, dark red text 
    case 'Interviewed':
      return 'bg-green-500 text-gray-700'; // Light green background, dark green text
    case 'Pending':
      return 'bg-blue-100 text-blue-700 '; // Light orange background, dark orange text
    default:
      return 'bg-gray-100 text-gray-700'; // Default light gray background, dark gray text
  }
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  };
  return date.toLocaleString('en-IN', options);
};
const JobApplyReviewed = () => {
  const statusOptions = [];
  const { auth } = useAuth()
  const location = useLocation();
  const query = new URLSearchParams(useLocation().search);
  const id = query.get('id');
  console.log("jobId", id)
  let [jobApplications, setjobApplications] = useState([])
  let [Status, setStatus] = useState(['Pending', 'Interviewed', 'Accepted', 'Rejected'])

  const { user_account_id = null, roles_id = null } = auth?.data || {};
  async function jobapplyData(signal) {
    try {

      let response = await axiosPrivate.get(`/api/jobapply/${user_account_id}`, { signal })
      let result = await response.data
      setjobApplications(result)
    }
    catch (err) {
      console.log(err)

    }
  }
  async function RecuterJob(signal) {
    try {

      let response = await axiosPrivate.get(`/api/ApplyJobscheck/${user_account_id}`, { signal })
      let result = await response.data
      console.log("resumt", result)
      setjobApplications(result)
    }
    catch (err) {
      console.log(err)

    }
  }
  useEffect(() => {
    let controller = new AbortController()
    let { signal } = controller
    if (user_account_id && id == null) {

      jobapplyData(signal)
    }
    if (id == 'Recuretpage') {
      RecuterJob(signal)
    }
    return () => {
      controller.abort(); // Cleanup function to abort the request if the component unmounts
    };
  }, [])
  const updateStatus = async (appliactionId, newstatus) => {
 
    try {
      // Perform the status update logic, such as making an API call.
      let controller = new AbortController()
      let { signal } = controller
      // For example:
      const response = await axiosPrivate.put(`/api/ApplyJobscheck/${appliactionId}`, JSON.stringify({ status: newstatus }),// Update this with the actual status you want to set
        { signal });
 
      if (response.status==200) {
        RecuterJob(signal)
        //throw new Error('Failed to update status');
      }


    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleStatusChange = (applicationId, newStatus) => {
    console.log(applicationId,newStatus)
    // setjobApplications(prevApplications =>
    //   prevApplications.map(app =>
    //     app.job_id === applicationId ? { ...app, status: newStatus } : app
    //   )
    // );
    updateStatus(applicationId, newStatus);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Application Dashboard</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        {id == "Recuretpage" ? <>
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border-b">candidate name</th>
              <th className="py-2 px-4 border-b">Job Title</th>
              <th className="py-2 px-4 border-b">Job experience</th>
              <th className="py-2 px-4 border-b">Company</th>
              <th className="py-2 px-4 border-b">Application Date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Action</th>
              <th className="py-2 px-4 border-b">Resume</th>
            </tr>
          </thead>
          <tbody>

            {jobApplications.length ? <>{jobApplications?.map((application) => (
              <tr key={application.job_id} className={getStatusClass(application.status)}>
                <td className="py-2 px-4 border-b">{application.first_name}</td>
                <td className="py-2 px-4 border-b">{application.title}</td>
                <td className="py-2 px-4 border-b">{application.experience} Year</td>
                <td className="py-2 px-4 border-b">{application.company_name ? application.company_name : application.company}</td>
                <td className="py-2 px-4 border-b">{formatDate(application.application_date)}</td>
                <td className="py-2 px-4 border-b">{application.status}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.appliactionid, e.target.value)}
                    className="bg-gray-200 border border-gray-300 rounded px-2 py-1"
                  >
                    {Status.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    style={{ cursor: 'pointer' }}
                   
                  >
                    View Resume
                  </a>
                </td>

                {/* <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => updateStatus(application.job_id, application.status)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Update Status
                      </button>
                    </td> */}
              </tr>
            ))}</>
              : <p>Not Apply Any job</p>}





          </tbody>



        </> : <>
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border-b">Job Title</th>
              <th className="py-2 px-4 border-b">Company</th>
              <th className="py-2 px-4 border-b">Application Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>

            {jobApplications.length ? <>{jobApplications?.map((application) => (
              <tr key={application.job_id} className={getStatusClass(application.status)}>
                <td className="py-2 px-4 border-b">{application.title}</td>
                <td className="py-2 px-4 border-b">{application.company_name ? application.company_name : application.company}</td>
                <td className="py-2 px-4 border-b">{formatDate(application.application_date)}</td>
                <td className="py-2 px-4 border-b">{application.status}</td>
              </tr>
            ))}</>
              : <p>Not Apply Any job</p>}





          </tbody>
        </>
        }
      </table>
    </div>
  );
};

export default JobApplyReviewed;
